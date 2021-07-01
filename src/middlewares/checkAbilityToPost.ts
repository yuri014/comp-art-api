import { UserInputError } from 'apollo-server-express';

import ArtistProfile from '../entities/ArtistProfile';

/**
 * Valida se artista pode postar ou não.
 */
const checkAbilityToPost = async (username: string) => {
  const profile = await ArtistProfile.findOne({ owner: username });

  if (!profile) {
    throw new UserInputError('Perfil não encontrado!');
  }

  if (profile.isBlockedToPost) {
    throw new UserInputError('Compartilhe outros artistas para voltar a publicar');
  }

  if (profile.postsRemainingToUnblock > 0) {
    throw new UserInputError('Compartilhe outros artistas para voltar a publicar');
  }

  return profile;
};

export default checkAbilityToPost;
