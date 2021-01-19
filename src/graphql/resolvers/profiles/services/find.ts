import { UserInputError } from 'apollo-server-express';
import ArtistProfile from '../../../../entities/ArtistProfile';
import UserProfile from '../../../../entities/UserProfile';
import { IToken } from '../../../../interfaces/Token';
import { IUser } from '../../../../interfaces/User';

const findProfile = async (user: IUser | IToken) => {
  const profile = user.isArtist
    ? await ArtistProfile.findOne({ owner: user.username })
    : await UserProfile.findOne({ owner: user.username });

  if (!profile) {
    throw new UserInputError('Perfil não encontrado');
  }

  return { ...profile._doc, isArtist: user.isArtist };
};

export default findProfile;
