import { AuthenticationError, IResolvers, PubSub, UserInputError } from 'apollo-server-express';

import ArtistProfile from '../../../entities/ArtistProfile';
import { ICreateProfile, IPixInput } from '../../../interfaces/Profile';
import checkAuth from '../../../middlewares/checkAuth';
import UserProfile from '../../../entities/UserProfile';
import User from '../../../entities/User';
import Following from '../../../entities/Following';
import getToken from '../../../auth/getToken';
import { ID } from '../../../interfaces/General';
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
import shuffleProfileArray from './services/utils/shuffleProfilesArray';
import pixValidationSchema from '../../../validators/pixSchema';

type IUsername = {
  username: string;
};

type Query = { query: string; offset: number; limit: number };

const profileResolvers: IResolvers = {
  Query: {
    async getProfile(_, { username }: IUsername) {
      return getProfileService(username);
    },

    async getLoggedProfile(_, __, context) {
      const user = checkAuth(context);

      return getLoggedProfileService(user);
    },

    async getIsFollowing(_, { id }: ID, context) {
      const user = checkAuth(context);

      return isFollowing(id, user.username);
    },

    async getFollowers(_, params: IOffset, context) {
      const token = getToken(context);

      return getFollowersService(params, token);
    },

    async getFollowing(_, params: IOffset, context) {
      const token = getToken(context);

      return getFollowingService(params, token);
    },

    async searchProfiles(_, { query, offset, limit }: Query) {
      return searchProfilesService(query, offset, limit);
    },

    async getSuggestedProfiles(_, params, context) {
      const user = checkAuth(context);
      const profile = await findProfile(user);

      if (!profile._doc) {
        throw new Error();
      }

      if (profile._doc.following === 0) {
        const suggestedUsers = await UserProfile.find({
          _id: { $nin: [profile._doc._id] },
        })
          .sort({ followers: -1 })
          .limit(2);
        const suggestedArtists = await ArtistProfile.find({
          _id: { $nin: [profile._doc._id] },
        })
          .sort({ followers: -1 })
          .limit(3);

        return shuffleProfileArray(suggestedArtists, suggestedUsers);
      }

      const following = await Following.findOne({ username: user.username })
        .populate('userFollowing', 'owner')
        .populate('artistFollowing', 'owner')
        .lean();

      if (!following) {
        throw new Error();
      }

      const followingIds = following.artistFollowing
        .map(artist => artist._id)
        .concat(following.userFollowing.map(userProfile => userProfile._id));

      const suggestedUsers = await UserProfile.find({
        _id: { $nin: [...followingIds, profile._doc._id] },
      })
        .sort({ followers: -1 })
        .limit(2);

      const suggestedArtists = await ArtistProfile.find({
        _id: { $nin: [...followingIds, profile._doc._id] },
      })
        .sort({ followers: -1 })
        .limit(3);

      return shuffleProfileArray(suggestedArtists, suggestedUsers);
    },

    async getAllProfiles() {
      const artists = await ArtistProfile.find().select('owner').lean();
      const users = await UserProfile.find().select('owner').lean();

      return artists.concat(users as []);
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
      const pubsub = context.pubsub as PubSub;

      return followService(userWhoFollows, username, pubsub);
    },

    async unfollow(_, { username }: IUsername, context) {
      const userWhoFollows = checkAuth(context);

      const followedUser = await User.findOne({ username });

      if (!followedUser) {
        throw new UserInputError('Usuário não encontrado');
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

    async createPix(_, { pix }: { pix: IPixInput }, context) {
      const user = checkAuth(context);

      if (!user.isArtist) {
        throw new AuthenticationError('Só artistas podem criar pix.');
      }

      const errors = pixValidationSchema.validate(pix);

      if (errors.error) {
        throw new UserInputError(errors.error.message);
      }

      await ArtistProfile.updateOne(
        { owner: user.username },
        { pix },
        { upsert: true, useFindAndModify: true },
      );

      return true;
    },
  },
};

export default profileResolvers;
