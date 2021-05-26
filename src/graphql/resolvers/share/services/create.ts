import { PubSub, UserInputError } from 'apollo-server-express';

import ArtistProfile from '../../../../entities/ArtistProfile';
import Post from '../../../../entities/Post';
import Share from '../../../../entities/Share';
import UserProfile from '../../../../entities/UserProfile';
import levelUp from '../../../../functions/levelUp';
import { IArtistProfile } from '../../../../interfaces/Profile';
import { IShareInput } from '../../../../interfaces/Share';
import { IToken } from '../../../../interfaces/Token';
import xpValues from '../../../../utils/xpValues';
import postValidationSchema from '../../../../validators/postSchema';
import createNotification from '../../notifications/services/create';

const createShare = async (user: IToken, input: IShareInput, pubsub: PubSub) => {
  const errors = postValidationSchema.validate({
    description: input.description?.trim(),
  });

  if (errors.error) {
    throw new UserInputError(errors.error.message);
  }

  if (!input.postID) {
    throw new UserInputError('Precisa de um post');
  }

  const profile = user.isArtist
    ? await ArtistProfile.findOne({ owner: user.username })
    : await UserProfile.findOne({ owner: user.username });

  if (!profile) {
    throw new UserInputError('Não há perfil');
  }

  const profileDoc = profile._doc;

  const post = await Post.findById(input.postID).populate('artist');

  if (!post) {
    throw new UserInputError('Precisa de um post');
  }

  const postOwner = post.artist as IArtistProfile;

  const newShare = new Share({
    description: input.description?.trim(),
    post: input.postID,
    createdAt: new Date().toISOString(),
    onModel: user.isArtist ? 'ArtistProfile' : 'UserProfile',
    profile: profileDoc?._id,
  });

  await newShare.save();

  await Post.findByIdAndUpdate(
    input.postID,
    {
      $inc: {
        sharedCount: 1,
      },
    },
    { useFindAndModify: false },
  );

  if (profileDoc?._id.equals(postOwner._id)) {
    await profile.updateOne({
      $inc: {
        postCount: 1,
      },
    });

    return false;
  }

  const { shareXP } = xpValues;

  if (user.isArtist) {
    const artist = profile as IArtistProfile;

    if (artist.postsRemainingToUnblock === 1) {
      await profile.updateOne({
        isBlockedToPost: false,
        $inc: {
          postsRemainingToUnblock: -1,
        },
      });
    } else if (artist.postsRemainingToUnblock > 1) {
      await profile.updateOne({
        $inc: {
          postsRemainingToUnblock: -1,
        },
      });
    }

    const updatedArtist = await artist.updateOne(
      {
        $inc: {
          postCount: 1,
          xp: shareXP,
        },
      },
      { new: true, useFindAndModify: false },
    );

    await createNotification(
      {
        body: 'compartilhou sua publicação',
        link: `/share/${newShare._id}`,
        from: user.username,
        username: postOwner.owner,
        avatar: updatedArtist.avatar,
      },
      pubsub,
    );

    return levelUp(updatedArtist);
  }

  const updatedProfile = await profile.updateOne(
    {
      $inc: {
        sharedPostCount: 1,
        xp: shareXP,
      },
    },
    { new: true },
  );

  await createNotification(
    {
      body: 'compartilhou sua publicação',
      link: `/share/${newShare._id}`,
      from: user.username,
      username: postOwner.owner,
      avatar: updatedProfile.avatar,
    },
    pubsub,
  );

  return levelUp(updatedProfile);
};

export default createShare;
