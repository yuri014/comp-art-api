import { UserInputError } from 'apollo-server-express';

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

const createShare = async (user: IToken, input: IShareInput) => {
  const errors = postValidationSchema.validate({
    description: input.description?.trim(),
  });

  if (errors.error) {
    throw new UserInputError('Erros', {
      errors: errors.error.message,
    });
  }

  if (!input.postID) {
    throw new UserInputError('Precisa de um post');
  }

  const profile = user.isArtist
    ? await ArtistProfile.findOne({ owner: user.username })
    : await UserProfile.findOne({ owner: user.username });

  if (!profile) {
    throw new UserInputError('Não há perfil', {
      errors: 'Não há perfil',
    });
  }

  const newShare = new Share({
    description: input.description?.trim(),
    post: input.postID,
    createdAt: new Date().toISOString(),
    onModel: user.isArtist ? 'ArtistProfile' : 'UserProfile',
    profile: profile._id,
  });

  await newShare.save();

  await Post.findByIdAndUpdate(input.postID, {
    $inc: {
      sharedCount: 1,
    },
  });

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
      // @ts-ignore
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
      { new: true },
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

  return levelUp(updatedProfile);
};

export default createShare;
