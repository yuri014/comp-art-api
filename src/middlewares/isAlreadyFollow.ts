import Follower from '../entities/Follower';
import Following from '../entities/Following';

export const isAlreadyFollow = async (id: string, username: string) => {
  const artistFollower = await Follower.findOne({
    username,
  }).select({
    artistFollowers: id,
  });

  const userFollower = await Follower.findOne({
    username,
  }).select({
    userFollowers: id,
  });

  return { artistFollower, userFollower };
};

export const isAlreadyFollowing = async (id: string, username: string) => {
  const artistFollowing = await Following.findOne({
    username,
  }).select({
    artistFollowing: id,
  });

  const userFollowing = await Following.findOne({
    username,
  }).select({
    userFollowing: id,
  });

  return { artistFollowing, userFollowing };
};
