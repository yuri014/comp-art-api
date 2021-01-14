import { IResolvers } from 'graphql-tools';
import { UserInputError } from 'apollo-server-express';

import ArtistProfile from '../../../entities/ArtistProfile';
import { ICreateProfile } from '../../../interfaces/Profile';
import checkAuth from '../../../middlewares/checkAuth';
import createProfile from './create';
import UserProfile from '../../../entities/UserProfile';

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
