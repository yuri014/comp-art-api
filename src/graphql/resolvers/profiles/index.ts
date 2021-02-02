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
import { follower, following } from './services/update';
import { unfollower, unfollowing } from './services/delete';
import { isAlreadyFollow } from '../../../middlewares/isAlreadyFollow';

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

    async getIsFollowing(_, { username }: { username: string }, context) {
      const user = checkAuth(context);

      const { artistFollower, userFollower } = await isAlreadyFollow(user.username, username);

      if (!artistFollower || !userFollower) return false;
      if (artistFollower.artistFollowers.length > 0 || userFollower.userFollowers.length > 0) {
        return true;
      }

      return false;
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
      const userWhoFollows = checkAuth(context);

      const followedUser = await User.findOne({ username });

      if (!followedUser) {
        throw new UserInputError('Usuário não encontrado', {
          errors: 'Usuário não encontrado',
        });
      }

      const profileWhoIsFollowed = await findProfile(followedUser);

      const authProfile = await findProfile(userWhoFollows);

      if (!authProfile._doc || !profileWhoIsFollowed._doc) {
        throw new Error();
      }

      await follower(userWhoFollows.isArtist, authProfile._doc, followedUser.username);

      await following(followedUser.isArtist, profileWhoIsFollowed._doc, userWhoFollows.username);

      return true;
    },

    async unfollow(_, { username }: { username: string }, context) {
      const userWhoFollows = checkAuth(context);

      const followedUser = await User.findOne({ username });

      if (!followedUser) {
        throw new UserInputError('Usuário não encontrado', {
          errors: 'Usuário não encontrado',
        });
      }

      const profileWhoIsFollowed = await findProfile(followedUser);

      const authProfile = await findProfile(userWhoFollows);

      if (!authProfile._doc || !profileWhoIsFollowed._doc) {
        throw new Error();
      }

      await unfollower(userWhoFollows.isArtist, authProfile._doc, followedUser.username);

      await unfollowing(followedUser.isArtist, profileWhoIsFollowed._doc, userWhoFollows.username);

      return true;
    },
  },
};

export default profileResolvers;
