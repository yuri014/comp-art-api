import Follower from '../../../../../entities/Follower';
import Following from '../../../../../entities/Following';
import { IFollower, IFollowing } from '../../../../../interfaces/Follow';
import { IArtistProfile, IUserProfile } from '../../../../../interfaces/Profile';
import { isAlreadyFollow } from '../../../../../middlewares/isAlreadyFollow';
import getUser from '../../../../../utils/getUser';
import findFollows, { IOffset } from '../utils/findFollows';
import shuffleArray from '../utils/shuffleProfilesArray';

const isFollowingLoggedUser = async (profile: IArtistProfile | IUserProfile, username: string) => {
  const isFollowing = await Follower.findOne({
    username,
    // @ts-ignore
    $or: [{ artistFollowers: profile._id }, { userFollowers: profile._id }],
  });

  if (isFollowing) {
    return { ...profile?._doc, followsYou: true };
  }

  return { ...profile?._doc, followsYou: false };
};

export const getFollowingService = async (params: IOffset, token: string) => {
  const followsResult = await findFollows(Following, params, ['artistFollowing', 'userFollowing']);

  const follows = followsResult as IFollowing;

  const profile = getUser(token);

  const artists = follows.artistFollowing || [];
  const users = follows.userFollowing || [];

  if (profile.username) {
    const artistsWithAuth = await Promise.all(
      artists.map(artist => isFollowingLoggedUser(artist, profile.username)),
    );
    const usersWithAuth = await Promise.all(
      users.map(user => isFollowingLoggedUser(user, profile.username)),
    );

    return shuffleArray(artistsWithAuth, usersWithAuth);
  }

  return shuffleArray(artists, users);
};

export const getFollowersService = async (params: IOffset, token: string) => {
  const followsResult = await findFollows(Follower, params, ['artistFollowers', 'userFollowers']);
  const followers = followsResult as IFollower;

  const profile = getUser(token);

  const artists = followers.artistFollowers || [];
  const users = followers.userFollowers || [];

  if (profile.username) {
    const artistsWithAuth = await Promise.all(
      artists.map(artist => isFollowingLoggedUser(artist, profile.username)),
    );
    const usersWithAuth = await Promise.all(
      users.map(user => isFollowingLoggedUser(user, profile.username)),
    );

    return shuffleArray(artistsWithAuth, usersWithAuth);
  }

  return shuffleArray(artists, users);
};

export const isFollowing = async (username: string, loggedUsername: string) => {
  const { artistFollower, userFollower } = await isAlreadyFollow(loggedUsername, username);

  if (!artistFollower || !userFollower) return false;
  if (artistFollower.artistFollowers.length > 0 || userFollower.userFollowers.length > 0) {
    return true;
  }

  return false;
};
