import { IResolvers, UserInputError } from 'apollo-server-express';

import ArtistProfile from '../../../entities/ArtistProfile';
import { ICreateProfile } from '../../../interfaces/Profile';
import checkAuth from '../../../middlewares/checkAuth';
import UserProfile from '../../../entities/UserProfile';
import User from '../../../entities/User';
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
import followService from './services/create/follow';
import updateProfileService from './services/update/profile';
import profileValidation from './services/utils/profileValidation';
import getToken from '../../../utils/getToken';

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

    async getFollowers(_, params: IOffset, context) {
      const token = getToken(context);

      return getFollowersService(params, token);
    },

    async getFollowing(_, params: IOffset, context) {
      const token = getToken(context);

      return getFollowingService(params, token);
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

      await profileValidation(
        user,
        newProfileInput.name,
        newProfileInput.bio,
        newProfileInput.hashtags,
      );

      if (user.isArtist) {
        await updateProfileService(user, ArtistProfile, newProfileInput);

        return true;
      }

      await updateProfileService(user, UserProfile, newProfileInput);

      return true;
    },

    async follow(_, { username }: IUsername, context) {
      const userWhoFollows = checkAuth(context);

      return followService(userWhoFollows, username);
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
