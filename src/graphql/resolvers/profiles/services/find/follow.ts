import Follower from '../../../../../entities/Follower';
import Following from '../../../../../entities/Following';
import { IFollower, IFollowing } from '../../../../../interfaces/Follow';
import { isAlreadyFollow } from '../../../../../middlewares/isAlreadyFollow';
import findFollows, { IOffset } from '../utils/findFollows';
import shuffleArray from '../utils/shuffleProfilesArray';

export const getFollowingService = async (params: IOffset) => {
  const followsResult = await findFollows(Following, params, ['artistFollowing', 'userFollowing']);

  const follows = followsResult as IFollowing;

  const artists = follows.artistFollowing || [];
  const users = follows.userFollowing || [];

  return shuffleArray(artists, users);
};

export const getFollowersService = async (params: IOffset) => {
  const followsResult = await findFollows(Follower, params, ['artistFollowers', 'userFollowers']);
  const followers = followsResult as IFollower;

  const artists = followers.artistFollowers || [];
  const users = followers.userFollowers || [];

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
