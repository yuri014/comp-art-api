import { UserInputError } from 'apollo-server-express';
import { LeanDocument } from 'mongoose';

import ArtistProfile from '../../../../../entities/ArtistProfile';
import UserProfile from '../../../../../entities/UserProfile';
import { IToken } from '../../../../../interfaces/Token';
import { IUser } from '../../../../../interfaces/User';

const findProfile = async (user: LeanDocument<IUser> | IToken, lean?: boolean) => {
  const getProfile = async () => {
    if (lean) {
      const profile = user.isArtist
        ? await ArtistProfile.findOne({ owner: user.username }).lean()
        : await UserProfile.findOne({ owner: user.username }).lean();

      return profile;
    }

    const profile = user.isArtist
      ? await ArtistProfile.findOne({ owner: user.username })
      : await UserProfile.findOne({ owner: user.username });

    return profile;
  };

  const profile = await getProfile();

  if (!profile) {
    throw new UserInputError('Perfil não encontrado');
  }

  return { ...profile, isArtist: user.isArtist };
};

export default findProfile;
