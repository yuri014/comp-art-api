import { IResolvers, UserInputError } from 'apollo-server-express';

import ArtistProfile from '../../../entities/ArtistProfile';
import { ICreateProfile } from '../../../interfaces/Profile';
import checkAuth from '../../../middlewares/checkAuth';
import UserProfile from '../../../entities/UserProfile';
import User from '../../../entities/User';
import { follower, following, updateProfileService } from './services/update';
import { unfollower, unfollowing } from './services/delete';
import findProfile from './services/utils/findProfileUtil';
import {
  getLoggedProfileService,
  getProfileService,
  searchProfilesService,
} from './services/find/profile';
import { getFollowersService, getFollowingService, isFollowing } from './services/find/follow';
import { IOffset } from './services/utils/findFollows';
import createProfile from './services/create/profile';

type IUsername = {
  username: string;
};

const profileResolvers: IResolvers = {
  Query: {
    async getProfile(_, { username }: IUsername) {
      return getProfileService(username);
    },

    async getLoggedProfile(_, __, context) {
      const user = checkAuth(context);

      return getLoggedProfileService(user);
    },

    async getIsFollowing(_, { username }: IUsername, context) {
      const user = checkAuth(context);

      return isFollowing(username, user.username);
    },

    async getFollowers(_, params: IOffset) {
      return getFollowersService(params);
    },

    async getFollowing(_, params: IOffset) {
      return getFollowingService(params);
    },

    async searchProfiles(_, { query, offset }: { query: string; offset: number }) {
      return searchProfilesService(query, offset);
    },
  },
  Mutation: {
    async createProfile(
      _,
      { createProfileInput }: { createProfileInput: ICreateProfile },
      context,
    ) {
      const user = checkAuth(context);

      if (user.isArtist) {
        return createProfile(user, ArtistProfile, createProfileInput);
      }

      return createProfile(user, UserProfile, createProfileInput);
    },

    async updateProfile(_, { newProfileInput }: { newProfileInput: ICreateProfile }, context) {
      const user = checkAuth(context);

      if (!user) {
        throw new UserInputError('Usuário não encontrado', {
          errors: 'Usuário não encontrado',
        });
      }

      if (newProfileInput.name.length < 4 || newProfileInput.name.length > 24) {
        throw new UserInputError('Erros', {
          errors: 'Nome deve contér mais de quatro caractéres',
        });
      }

      if (user.isArtist) {
        await updateProfileService(user, ArtistProfile, newProfileInput);

        return true;
      }

      await updateProfileService(user, UserProfile, newProfileInput);

      return true;
    },

    async follow(_, { username }: IUsername, context) {
      const userWhoFollows = checkAuth(context);

      const followedUser = await User.findOne({ username });

      if (!followedUser) {
        throw new UserInputError('Usuário não encontrado', {
          errors: 'Usuário não encontrado',
        });
      }

      if (username === userWhoFollows.username) {
        throw new UserInputError('Usuário não pode se seguir', {
          errors: 'Usuário não pode se seguir',
        });
      }

      const profileWhoIsFollowed = await findProfile(followedUser);

      const authProfile = await findProfile(userWhoFollows);

      if (!authProfile._doc || !profileWhoIsFollowed._doc) {
        throw new Error();
      }

      await follower(userWhoFollows.isArtist, authProfile._doc._id, followedUser.username);

      await following(
        followedUser.isArtist,
        profileWhoIsFollowed._doc._id,
        userWhoFollows.username,
      );

      return true;
    },

    async unfollow(_, { username }: IUsername, context) {
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
