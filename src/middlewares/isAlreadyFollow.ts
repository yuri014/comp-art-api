import Follower from '../entities/Follower';
import Following from '../entities/Following';

export const isAlreadyFollow = async (id: string, username: string) => {
  const artistFollower = await Follower.findOne({
    username,
    // @ts-ignore
    artistFollowers: id,
  });

  const userFollower = await Follower.findOne({
    username,
    // @ts-ignore
    userFollowers: id,
  });

  return { artistFollower, userFollower };
};

export const isAlreadyFollowing = async (id: string, username: string) => {
  const artistFollowing = await Following.findOne({
    username,
    // @ts-ignore
    artistFollowing: id,
  });

  const userFollowing = await Following.findOne({
    username,
    // @ts-ignore
    userFollowing: id,
  });

  return { artistFollowing, userFollowing };
};
