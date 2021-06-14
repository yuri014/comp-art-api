import getUser from '../../../../../auth/getUser';
import Follower from '../../../../../entities/Follower';
import Following from '../../../../../entities/Following';
import { IFollower, IFollowing } from '../../../../../interfaces/Follow';
import { IToken } from '../../../../../interfaces/Token';
import { isAlreadyFollowing } from '../../../../../middlewares/isAlreadyFollow';
import followersWithAuth from '../utils/findFollowersWithAuth';
import findFollows, { IOffset } from '../utils/findFollows';
import shuffleArray from '../utils/shuffleProfilesArray';

export const getFollowingService = async (params: IOffset, token: string) => {
  const followsResult = await findFollows(Following, params, ['artistFollowing', 'userFollowing']);

  const follows = followsResult as IFollowing;

  const user = getUser(token);

  const artists = follows.artistFollowing || [];
  const users = follows.userFollowing || [];

  if (user) {
    const authUser = user as IToken;

    return followersWithAuth(authUser, artists, users);
  }

  return shuffleArray(artists, users);
};

export const getFollowersService = async (params: IOffset, token: string) => {
  const followsResult = await findFollows(Follower, params, ['artistFollowers', 'userFollowers']);
  const followers = followsResult as IFollower;

  const user = getUser(token);

  const artists = followers.artistFollowers || [];
  const users = followers.userFollowers || [];

  if (user) {
    const authUser = user as IToken;

    return followersWithAuth(authUser, artists, users);
  }

  return shuffleArray(artists, users);
};

export const isFollowing = async (id: string, loggedUsername: string) => {
  const { artistFollowing, userFollowing } = await isAlreadyFollowing(id, loggedUsername);

  if (artistFollowing || userFollowing) {
    return true;
  }

  return false;
};
