import { UserInputError } from 'apollo-server-express';
import ArtistProfile from '../../../../entities/ArtistProfile';
import Follower from '../../../../entities/Follower';
import Following from '../../../../entities/Following';
import UserProfile from '../../../../entities/UserProfile';
import { isAlreadyFollow, isAlreadyFollowing } from '../../../../middlewares/isAlreadyFollow';

const options = {
  upsert: true,
  new: true,
  setDefaultsOnInsert: true,
  useFindAndModify: false,
};

export const follower = async (
  isArtist: boolean,
  profileIdThatFollows: string,
  userWhoIsFollowed: string,
) => {
  const { artistFollower, userFollower } = await isAlreadyFollow(
    profileIdThatFollows,
    userWhoIsFollowed,
  );

  if (isArtist) {
    if (artistFollower && artistFollower.artistFollowers.length > 0) {
      throw new UserInputError('Já é seguido');
    }

    await ArtistProfile.findByIdAndUpdate(
      profileIdThatFollows,
      { $inc: { following: 1 } },
      { useFindAndModify: false },
    );
    return Follower.findOneAndUpdate(
      {
        username: userWhoIsFollowed,
      },
      {
        $set: {
          // @ts-ignore
          artistFollowers: profileIdThatFollows,
        },
      },
      options,
    );
  }

  if (userFollower && userFollower.userFollowers.length > 0) {
    throw new UserInputError('Já é seguido');
  }

  await UserProfile.findByIdAndUpdate(
    profileIdThatFollows,
    { $inc: { following: 1 } },
    { useFindAndModify: false },
  );

  return Follower.findOneAndUpdate(
    {
      username: userWhoIsFollowed,
    },
    {
      $set: {
        // @ts-ignore
        userFollowers: profileIdThatFollows,
      },
    },
    options,
  );
};

export const following = async (
  isArtist: boolean,
  profileIdThatIsFollowing: string,
  userWhoIsFollowing: string,
) => {
  const { artistFollowing, userFollowing } = await isAlreadyFollowing(
    profileIdThatIsFollowing,
    userWhoIsFollowing,
  );

  if (isArtist) {
    if (artistFollowing && artistFollowing.artistFollowing.length > 0) {
      throw new UserInputError('Já é seguido');
    }
    await ArtistProfile.findByIdAndUpdate(
      profileIdThatIsFollowing,
      { $inc: { followers: 1 } },
      { useFindAndModify: false },
    );

    return Following.findOneAndUpdate(
      {
        username: userWhoIsFollowing,
      },
      {
        $set: {
          // @ts-ignore
          artistFollowing: profileIdThatIsFollowing,
        },
      },
      options,
    );
  }
  if (userFollowing && userFollowing.userFollowing.length > 0) {
    throw new UserInputError('Já é seguido');
  }

  await UserProfile.findByIdAndUpdate(
    profileIdThatIsFollowing,
    { $inc: { followers: 1 } },
    { useFindAndModify: false },
  );

  return Following.findOneAndUpdate(
    {
      username: userWhoIsFollowing,
    },
    {
      $set: {
        // @ts-ignore
        userFollowing: profileIdThatIsFollowing,
      },
    },
    options,
  );
};
