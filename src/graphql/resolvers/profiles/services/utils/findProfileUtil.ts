import { UserInputError } from 'apollo-server-express';
import { LeanDocument } from 'mongoose';

import ArtistProfile from '../../../../../entities/ArtistProfile';
import Follower from '../../../../../entities/Follower';
import Following from '../../../../../entities/Following';
import UserProfile from '../../../../../entities/UserProfile';
import { IToken } from '../../../../../interfaces/Token';
import { IUser } from '../../../../../interfaces/User';

const findProfile = async (user: LeanDocument<IUser> | IToken, lean?: boolean) => {
  const getProfile = async () => {
    if (lean) {
      const profile = user.isArtist
        ? await ArtistProfile.findOne({ owner: user.username }).lean()
        : await UserProfile.findOne({ owner: user.username }).lean();

      return profile;
    }

    const profile = user.isArtist
      ? await ArtistProfile.findOne({ owner: user.username })
      : await UserProfile.findOne({ owner: user.username });

    return profile;
  };

  const profile = await getProfile();

  if (!profile) {
    throw new UserInputError('Perfil não encontrado');
  }

  const sumFollows = (
    follow: { [key: string]: number }[],
    userField: string,
    artistField: string,
  ) => {
    if (follow.length === 0) {
      return 0;
    }

    const follows = follow[0];

    const userLength = follows[userField.toString()];
    const artistLength = follows[artistField.toString()];

    return userLength + artistLength;
  };

  const followers = await Follower.aggregate()
    .match({ username: profile.owner })
    .project({
      userFollowersLength: { $size: '$userFollowers' },
      artistFollowersLength: { $size: '$artistFollowers' },
    });

  const followersLength = sumFollows(followers, 'userFollowersLength', 'artistFollowersLength');

  const following = await Following.aggregate()
    .match({ username: profile.owner })
    .project({
      userFollowingLength: { $size: '$userFollowing' },
      artistFollowingLength: { $size: '$artistFollowing' },
    });

  const followingLength = sumFollows(following, 'userFollowingLength', 'artistFollowingLength');

  profile.followers = followersLength;
  profile.following = followingLength;

  return { ...profile, isArtist: user.isArtist };
};

export default findProfile;
