import { AuthenticationError, UserInputError } from 'apollo-server-express';
import ArtistProfile from '../../../../entities/ArtistProfile';

import Share from '../../../../entities/Share';
import UserProfile from '../../../../entities/UserProfile';
import levelDown from '../../../../functions/levelDown';
import { IArtistProfile, IUserProfile } from '../../../../interfaces/Profile';
import { IToken } from '../../../../interfaces/Token';
import genericUpdateOptions from '../../../../utils/genericUpdateOptions';
import xpValues from '../../../../utils/xpValues';

const deleteShareService = async (id: string, user: IToken) => {
  const share = await Share.findById(id).populate('profile');

  if (!share) {
    throw new UserInputError('Não há compartilhamento');
  }

  const profile = share.profile as IArtistProfile | IUserProfile;

  if (profile.owner !== user.username) {
    throw new AuthenticationError('Você não é o autor deste compartilhamento');
  }

  try {
    await share.deleteOne();
  } catch (error) {
    throw new Error(error);
  }

  const updateProfile = async () => {
    if (user.isArtist) {
      const artist = await ArtistProfile.findOne({ owner: user.username });

      return artist?.updateOne(
        {
          $inc: {
            postCount: artist.postCount > 0 ? -1 : 0,
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

  const { shareXP } = xpValues;

  return levelDown(updatedProfile, shareXP);
};

export default deleteShareService;
