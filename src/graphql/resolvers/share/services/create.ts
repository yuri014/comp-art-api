import { PubSub, UserInputError } from 'apollo-server-express';

import ArtistProfile from '../../../../entities/ArtistProfile';
import Post from '../../../../entities/Post';
import Share from '../../../../entities/Share';
import UserProfile from '../../../../entities/UserProfile';
import levelUp from '../../../../functions/levelUp';
import mentionUser from '../../../../functions/mentionUser';
import { IArtistProfile } from '../../../../interfaces/Profile';
import { IShareInput } from '../../../../interfaces/Share';
import { IToken } from '../../../../interfaces/Token';
import genericUpdateOptions from '../../../../utils/genericUpdateOptions';
import xpValues from '../../../../utils/xpValues';
import { shareValidation } from '../../../../validators/postSchema';
import createNotification from '../../notifications/services/create';

const createShare = async (user: IToken, input: IShareInput, pubsub: PubSub) => {
  const errors = shareValidation.validate({
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

  newShare.save();

  mentionUser({
    avatar: profile._doc?.avatar as string,
    description: input.description,
    from: user.username,
    link: `/share/${newShare._id}`,
    pubsub,
  });

  Post.findByIdAndUpdate(
    input.postID,
    {
      $inc: {
        sharedCount: 1,
      },
    },
    { useFindAndModify: false },
  );

  if (profileDoc?._id.equals(postOwner._id)) {
    profile.updateOne(
      {
        $inc: {
          postCount: 1,
        },
      },
      { useFindAndModify: false },
    );

    return { levelUp: false, isFreeToPost: false };
  }

  const { shareXP } = xpValues;

  if (user.isArtist) {
    const artist = profile as IArtistProfile;

    if (artist.postsRemainingToUnblock === 1) {
      await profile.updateOne(
        {
          isBlockedToPost: false,
          $inc: {
            postsRemainingToUnblock: -1,
          },
        },
        { useFindAndModify: false },
      );
    } else if (artist.postsRemainingToUnblock > 1) {
      await profile.updateOne(
        {
          $inc: {
            postsRemainingToUnblock: -1,
          },
        },
        { useFindAndModify: false },
      );
    }

    const updatedArtist = await ArtistProfile.findByIdAndUpdate(
      profile._doc?._id,
      {
        $inc: {
          postCount: 1,
          xp: shareXP,
        },
      },
      genericUpdateOptions,
    );

    if (!updatedArtist) {
      throw new Error('Não encontrou perfil ao compartilhar');
    }

    createNotification(
      {
        body: 'compartilhou sua publicação',
        link: `/share/${newShare._id}`,
        from: user.username,
        username: postOwner.owner,
        avatar: profile._doc?.avatar as string,
      },
      pubsub,
    );

    return {
      levelUp: levelUp(updatedArtist),
      isFreeToPost: !updatedArtist.isBlockedToPost,
    };
  }

  const updatedProfile = await UserProfile.findByIdAndUpdate(
    profile._doc?._id,
    {
      $inc: {
        sharedPostCount: 1,
        xp: shareXP,
      },
    },
    genericUpdateOptions,
  );

  if (!updatedProfile) {
    throw new Error('Não encontrou perfil ao compartilhar');
  }

  createNotification(
    {
      body: 'compartilhou sua publicação',
      link: `/share/${newShare._id}`,
      from: user.username,
      username: postOwner.owner,
      avatar: profile._doc?.avatar as string,
    },
    pubsub,
  );

  return {
    levelUp: levelUp(updatedProfile),
    isFreeToPost: false,
  };
};

export default createShare;
