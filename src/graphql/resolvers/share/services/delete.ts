import { AuthenticationError, UserInputError } from 'apollo-server-express';

import ArtistProfile from '../../../../entities/ArtistProfile';
import Comments from '../../../../entities/Comments';
import Share from '../../../../entities/Share';
import UserProfile from '../../../../entities/UserProfile';
import levelDown from '../../../../functions/levelDown';
import { IProfileEntity } from '../../../../interfaces/Models';
import { IToken } from '../../../../interfaces/Token';
import genericUpdateOptions from '../../../../utils/genericUpdateOptions';
import xpValues from '../../../../utils/xpValues';

const deleteShareService = async (id: string, user: IToken) => {
  const share = await Share.findById(id).populate('profile');

  if (!share) {
    throw new UserInputError('Não há compartilhamento');
  }

  const profile = share.profile as IProfileEntity;

  if (profile.owner !== user.username) {
    throw new AuthenticationError('Você não é o autor deste compartilhamento');
  }

  try {
    await share.deleteOne();
  } catch (error) {
    throw new Error(error);
  }

  const updateProfile = () => {
    if (user.isArtist) {
      return ArtistProfile.findOneAndUpdate(
        { owner: user.username },
        {
          $inc: {
            postCount: -1,
          },
        },
        genericUpdateOptions,
      );
    }

    return UserProfile.findOneAndUpdate(
      { owner: user.username },
      {
        $inc: {
          sharedPostCount: -1,
        },
      },
      genericUpdateOptions,
    );
  };

  const updatedProfile = await updateProfile();

  if (!updatedProfile) {
    throw new Error();
  }

  await Comments.deleteMany({ post: id });

  const { shareXP } = xpValues;

  return levelDown(updatedProfile, shareXP);
};

export default deleteShareService;
