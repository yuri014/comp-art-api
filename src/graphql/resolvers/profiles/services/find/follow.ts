import getUser from '../../../../../auth/getUser';
import Follower from '../../../../../entities/Follower';
import Following from '../../../../../entities/Following';
import { IFollower, IFollowing } from '../../../../../interfaces/Follow';
import { IProfileEntity } from '../../../../../interfaces/Models';
import { IArtistProfile, IUserProfile } from '../../../../../interfaces/Profile';
import { IToken } from '../../../../../interfaces/Token';
import { isAlreadyFollowing } from '../../../../../middlewares/isAlreadyFollow';
import findFollows, { IOffset } from '../utils/findFollows';
import shuffleArray from '../utils/shuffleProfilesArray';

const isFollowingLoggedUser = async (profile: IProfileEntity, username: string) => {
  const isFollowing = await Follower.findOne({
    username,
    // @ts-ignore
    $or: [{ artistFollowers: profile._id }, { userFollowers: profile._id }],
  }).lean();

  if (isFollowing) {
    return { ...profile?._doc, followsYou: true };
  }

  return { ...profile?._doc, followsYou: false };
};

const followersWithAuth = async (
  user: IToken | string,
  artists: IArtistProfile[],
  users: IUserProfile[],
) => {
  const authUser = user as IToken;

  const artistsWithAuth = await Promise.all(
    artists.map(artist => isFollowingLoggedUser(artist, authUser.username)),
  );
  const usersWithAuth = await Promise.all(
    users.map(_user => isFollowingLoggedUser(_user, authUser.username)),
  );

  return shuffleArray(artistsWithAuth, usersWithAuth);
};

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
