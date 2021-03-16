import { UserInputError } from 'apollo-server-express';
import { IArtistProfile, IUserProfile } from '../../../../../interfaces/Profile';

import { IToken } from '../../../../../interfaces/Token';
import profileValidationSchema from '../../../../../validators/profileSchema';

const profileValidation = async (
  user: IToken,
  name: string,
  bio: string,
  hashtags: Array<string>,
) => {
  if (!user) {
    throw new UserInputError('Usuário não encontrado', {
      errors: 'Usuário não encontrado',
    });
  }

  const errors = profileValidationSchema.validate({
    name,
    bio,
  });

  if (errors.error) {
    throw new UserInputError('Erros', {
      errors: errors.error.message,
    });
  }

  const hashtagsLength = hashtags.length;

  if (hashtagsLength > 5 || hashtagsLength !== new Set(hashtags).size) {
    throw new UserInputError('Limite de 5 hashtags não repetidas', {
      errors: 'Limite de 5 hashtags não repetidas',
    });
  }

  return async (profileExists: IArtistProfile | IUserProfile | null) => {
    if (profileExists) {
      throw new UserInputError('Usuário já é dono de um perfil', {
        errors: 'Usuário já é dono de um perfil',
      });
    }
  };
};

export default profileValidation;
