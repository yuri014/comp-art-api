import Follower from '../../../../../entities/Follower';
import Following from '../../../../../entities/Following';
import { IProfileEntity } from '../../../../../interfaces/Models';
import { IArtistProfile, IUserProfile } from '../../../../../interfaces/Profile';
import { IToken } from '../../../../../interfaces/Token';
import shuffleProfileArray from './shuffleProfilesArray';

export const isFollowingLoggedUser = async (
  profile: IProfileEntity,
  username: string,
  isArtist?: boolean,
) => {
  const followsYou = await Follower.findOne({
    username,
    $or: [{ artistFollowers: profile._id }, { userFollowers: profile._id }],
  }).lean();

  const isFollowing = await Following.findOne({
    username,
    $or: [{ artistFollowing: profile._id }, { userFollowing: profile._id }],
  }).lean();

  return { ...profile?._doc, isArtist, followsYou: !!followsYou, isFollowing: !!isFollowing };
};

const followersWithAuth = async (
  user: IToken | string,
  artists: IArtistProfile[],
  users: IUserProfile[],
) => {
  const authUser = user as IToken;

  const artistsWithAuth = await Promise.all(
    artists.map(artist => isFollowingLoggedUser(artist, authUser.username, true)),
  );
  const usersWithAuth = await Promise.all(
    users.map(_user => isFollowingLoggedUser(_user, authUser.username, false)),
  );

  return shuffleProfileArray(artistsWithAuth, usersWithAuth);
};

export default followersWithAuth;
