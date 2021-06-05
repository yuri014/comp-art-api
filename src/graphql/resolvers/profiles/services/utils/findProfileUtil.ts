import { UserInputError } from 'apollo-server-express';
import { LeanDocument } from 'mongoose';

import ArtistProfile from '../../../../../entities/ArtistProfile';
import UserProfile from '../../../../../entities/UserProfile';
import { IToken } from '../../../../../interfaces/Token';
import { IUser } from '../../../../../interfaces/User';

const findProfile = async (user: LeanDocument<IUser> | IToken) => {
  const profile = user.isArtist
    ? await ArtistProfile.findOne({ owner: user.username })
    : await UserProfile.findOne({ owner: user.username });

  if (!profile) {
    throw new UserInputError('Perfil não encontrado');
  }

  return { ...profile, isArtist: user.isArtist };
};

export default findProfile;
