import { IResolvers } from 'graphql-tools';
import { UserInputError } from 'apollo-server-express';

import ArtistProfile from '../../../entities/ArtistProfile';
import { ICreateProfile } from '../../../interfaces/Profile';
import checkAuth from '../../../middlewares/checkAuth';
import createProfile from './services/create';
import UserProfile from '../../../entities/UserProfile';
import profileValidationSchema from '../../../validators/profileSchema';
import User from '../../../entities/User';
import findProfile from './services/find';
import Follower from '../../../entities/Follower';
import Following from '../../../entities/Following';

const profileResolvers: IResolvers = {
  Query: {
    async getProfile(_, { username }) {
      const user = await User.findOne({ username });

      if (!user) {
        throw new UserInputError('Usuário não encontrado');
      }

      const profile = await findProfile(user);

      return { ...profile._doc, isArtist: profile.isArtist };
    },

    async getLoggedProfile(parent, args, context) {
      const user = checkAuth(context);

      const profile = await findProfile(user);

      return { ...profile._doc, isArtist: profile.isArtist };
    },
  },
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
    async follow(_, { username }: { username: string }, context) {
      const user = checkAuth(context);

      const followedUser = await User.findOne({ username });

      if (!followedUser) {
        throw new UserInputError('Usuário não encontrado', {
          errors: 'Usuário não encontrado',
        });
      }

      const followed = await findProfile(followedUser);

      const authProfile = await findProfile(user);

      if (!authProfile) {
        throw new Error();
      }

      const options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        useFindAndModify: false,
      };

      if (followed.isArtist && authProfile._doc) {
        const profile = authProfile._doc;
        await Follower.findOneAndUpdate(
          {
            username: followedUser.username,
          },
          {
            $set: {
              artistFollowers: {
                avatar: profile.avatar,
                owner: profile.owner,
              },
            },
          },
          options,
        );
      } else {
        const profile = authProfile._doc;
        if (profile) {
          await Follower.findOneAndUpdate(
            {
              username: followedUser.username,
            },
            {
              $set: {
                userFollowers: {
                  avatar: profile.avatar,
                  owner: profile.owner,
                },
              },
            },
            options,
          );
        }
      }

      if (user.isArtist && followed._doc) {
        const profile = followed._doc;
        await Following.findOneAndUpdate(
          {
            username: user.username,
          },
          {
            $set: {
              artistFollowing: {
                avatar: profile.avatar,
                owner: profile.owner,
              },
            },
          },
          options,
        );
      } else {
        const profile = followed._doc;
        if (profile) {
          await Following.findOneAndUpdate(
            {
              username: user.username,
            },
            {
              $set: {
                userFollowing: {
                  avatar: followed.avatar,
                  owner: followed.owner,
                },
              },
            },
            options,
          );
        }
      }

      return true;
    },
  },
};

export default profileResolvers;
