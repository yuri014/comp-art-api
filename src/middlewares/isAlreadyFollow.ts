import Follower from '../entities/Follower';
import Following from '../entities/Following';

export const isAlreadyFollow = async (owner: string, username: string) => {
  const artistFollower = await Follower.findOne({
    username,
  }).select({
    artistFollowers: {
      $elemMatch: {
        owner,
      },
    },
  });

  const userFollower = await Follower.findOne({
    username,
  }).select({
    userFollowers: {
      $elemMatch: {
        owner,
      },
    },
  });

  return { artistFollower, userFollower };
};

export const isAlreadyFollowing = async (owner: string, username: string) => {
  const artistFollowing = await Following.findOne({
    username,
  }).select({
    artistFollowing: {
      $elemMatch: {
        owner,
      },
    },
  });

  const userFollowing = await Following.findOne({
    username,
  }).select({
    userFollowing: {
      $elemMatch: {
        owner,
      },
    },
  });

  return { artistFollowing, userFollowing };
};
