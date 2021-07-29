import getUser from '../../../../../auth/getUser';
import Follower from '../../../../../entities/Follower';
import Following from '../../../../../entities/Following';
import { IFollower, IFollowing } from '../../../../../interfaces/Follow';
import { IToken } from '../../../../../interfaces/Token';
import { isAlreadyFollowing } from '../../../../../middlewares/isAlreadyFollow';
import followersWithAuth from '../utils/findFollowersWithAuth';
import findFollows, { IOffset } from '../utils/findFollows';
import shuffleProfileArray from '../utils/shuffleProfilesArray';

export const getFollowingService = async (params: IOffset, token: string) => {
  const followsResult = await findFollows(Following, params, ['artistFollowing', 'userFollowing']);

  const follows = (followsResult as unknown) as IFollowing;

  const user = getUser(token);

  if (user) {
    const authUser = user as IToken;

    const artists = follows.artistFollowing || [];
    const users = follows.userFollowing || [];

    return followersWithAuth(authUser, artists, users);
  }

  const artistWithIsArtistField = follows.artistFollowing.map(artist => ({
    ...artist._doc,
    isArtist: true,
  }));
  const usersWithIsArtistField = follows.userFollowing.map(artist => ({
    ...artist._doc,
    isArtist: false,
  }));

  const artists = artistWithIsArtistField || [];
  const users = usersWithIsArtistField || [];

  return shuffleProfileArray(artists, users);
};

export const getFollowersService = async (params: IOffset, token: string) => {
  const followsResult = await findFollows(Follower, params, ['artistFollowers', 'userFollowers']);
  const followers = followsResult as IFollower;

  const user = getUser(token);

  if (user) {
    const authUser = user as IToken;
    const artists = followers.artistFollowers || [];
    const users = followers.userFollowers || [];

    return followersWithAuth(authUser, artists, users);
  }

  const artistWithIsArtistField = followers.artistFollowers.map(artist => ({
    ...artist._doc,
    isArtist: true,
  }));

  const usersWithIsArtistField = followers.userFollowers.map(_user => ({
    ..._user._doc,
    isArtist: false,
  }));

  const artists = artistWithIsArtistField || [];
  const users = usersWithIsArtistField || [];

  return shuffleProfileArray(artists, users);
};

export const isFollowing = async (id: string, loggedUsername: string) => {
  const { artistFollowing, userFollowing } = await isAlreadyFollowing(id, loggedUsername);

  if (artistFollowing || userFollowing) {
    return true;
  }

  return false;
};
