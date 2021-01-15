import { IResolvers } from 'graphql-tools';
import { UserInputError } from 'apollo-server-express';

import ArtistProfile from '../../../entities/ArtistProfile';
import { ICreateProfile } from '../../../interfaces/Profile';
import checkAuth from '../../../middlewares/checkAuth';
import createProfile from './services/create';
import UserProfile from '../../../entities/UserProfile';
import profileValidationSchema from '../../../validators/profileSchema';

const profileResolvers: IResolvers = {
  Mutation: {
    async createProfile(
      _,
      { createProfileInput }: { createProfileInput: ICreateProfile },
      context,
    ) {
      const user = checkAuth(context);

      if (!user) {
        throw new UserInputError('Usuário não encontrado', {
          errors: 'Usuário não encontrado',
        });
      }

      const errors = profileValidationSchema.validate({
        name: createProfileInput.name,
        bio: createProfileInput.bio,
      });

      if (errors.error) {
        throw new UserInputError('Erros', {
          errors: errors.error.message,
        });
      }

      if (user.isArtist) {
        await createProfile(user, ArtistProfile, createProfileInput);

        return true;
      }

      await createProfile(user, UserProfile, createProfileInput);

      return true;
    },
  },
};

export default profileResolvers;
