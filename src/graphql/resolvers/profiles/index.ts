import { IResolvers, UserInputError } from 'apollo-server-express';

import ArtistProfile from '../../../entities/ArtistProfile';
import { ICreateProfile } from '../../../interfaces/Profile';
import checkAuth from '../../../middlewares/checkAuth';
import createProfile from './services/create';
import UserProfile from '../../../entities/UserProfile';
import profileValidationSchema from '../../../validators/profileSchema';
import User from '../../../entities/User';
import { follower, following, updateProfileService } from './services/update';
import { unfollower, unfollowing } from './services/delete';
import { isAlreadyFollow } from '../../../middlewares/isAlreadyFollow';
import Follower from '../../../entities/Follower';
import Following from '../../../entities/Following';
import findProfile from './services/utils/findProfileUtil';
import findFollows from './services/find';
import { IFollower, IFollowing } from '../../../interfaces/Follow';
import shuffleArray from './services/utils/shuffleProfilesArray';

type IUsername = {
  username: string;
};

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

      const profileView = profile._doc;

      if (!profileView) {
        throw new Error();
      }

      const targetXp = 1000 * profileView.level * 1.25;

      profileView.xp = Math.floor((profileView.xp / targetXp) * 100);

      return { ...profileView, isArtist: profile.isArtist };
    },

    async getIsFollowing(_, { username }: IUsername, context) {
      const user = checkAuth(context);

      const { artistFollower, userFollower } = await isAlreadyFollow(user.username, username);

      if (!artistFollower || !userFollower) return false;
      if (artistFollower.artistFollowers.length > 0 || userFollower.userFollowers.length > 0) {
        return true;
      }

      return false;
    },

    async getFollowers(_, params: { offset: number; username: string }) {
      const followsResult = await findFollows(Follower, params, [
        'artistFollowers',
        'userFollowers',
      ]);
      const followers = followsResult as IFollower;

      const artists = followers.artistFollowers || [];
      const users = followers.userFollowers || [];

      return shuffleArray(artists, users);
    },

    async getFollowing(_, params: { offset: number; username: string }) {
      const followsResult = await findFollows(Following, params, [
        'artistFollowing',
        'userFollowing',
      ]);

      const follows = followsResult as IFollowing;

      const artists = follows.artistFollowing || [];
      const users = follows.userFollowing || [];

      return shuffleArray(artists, users);
    },

    async searchProfiles(_, { query, offset }: { query: string; offset: number }) {
      const artistsProfiles = await ArtistProfile.find({ $text: { $search: query } })
        .skip(offset > 0 ? Math.round(offset / 2) : offset)
        .limit(5);

      const usersProfiles = await UserProfile.find({ $text: { $search: query } })
        .skip(offset > 0 ? Math.round(offset / 2) : offset)
        .limit(5);

      return shuffleArray(artistsProfiles, usersProfiles);
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
