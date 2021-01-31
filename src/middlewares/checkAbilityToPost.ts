import { UserInputError } from 'apollo-server-express';

import ArtistProfile from '../entities/ArtistProfile';

const checkAbilityToPost = async (username: string) => {
  const profile = await ArtistProfile.findOne({ owner: username });

  if (!profile) {
    throw new UserInputError('Perfil não encontrado!');
  }

  if (profile.isBlockedToPost) {
    throw new UserInputError('Perfil bloqueado para postar');
  }

  if (profile.postsRemainingToUnblock > 0) {
    throw new UserInputError('Perfil bloqueado para postar');
  }

  return profile;
};

export default checkAbilityToPost;
