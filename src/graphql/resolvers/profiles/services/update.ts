import { UserInputError } from 'apollo-server-express';
import ArtistProfile from '../../../../entities/ArtistProfile';
import Follower from '../../../../entities/Follower';
import Following from '../../../../entities/Following';
import UserProfile from '../../../../entities/UserProfile';
import { IProfileView } from '../../../../interfaces/Profile';
import { isAlreadyFollow, isAlreadyFollowing } from '../../../../middlewares/isAlreadyFollow';

const options = {
  upsert: true,
  new: true,
  setDefaultsOnInsert: true,
  useFindAndModify: false,
};

export const follower = async (
  isArtist: boolean,
  profileThatFollows: IProfileView,
  userWhoIsFollowed: string,
) => {
  const { artistFollower, userFollower } = await isAlreadyFollow(
    profileThatFollows.owner,
    userWhoIsFollowed,
  );

  if (isArtist) {
    if (artistFollower && artistFollower.artistFollowers.length > 0) {
      throw new UserInputError('Já é seguido');
    }

    await ArtistProfile.findOneAndUpdate(
      { owner: profileThatFollows.owner },
      { $inc: { following: 1 } },
      { useFindAndModify: false },
    );
    return Follower.findOneAndUpdate(
      {
        username: userWhoIsFollowed,
      },
      {
        $set: {
          artistFollowers: {
            // @ts-ignore
            avatar: profileThatFollows.avatar,
            owner: profileThatFollows.owner,
            name: profileThatFollows.name,
          },
        },
      },
      options,
    );
  }

  if (userFollower && userFollower.userFollowers.length > 0) {
    throw new UserInputError('Já é seguido');
  }

  await UserProfile.findOneAndUpdate(
    { owner: profileThatFollows.owner },
    { $inc: { following: 1 } },
    { useFindAndModify: false },
  );

  return Follower.findOneAndUpdate(
    {
      username: userWhoIsFollowed,
    },
    {
      $set: {
        userFollowers: {
          // @ts-ignore
          avatar: profileThatFollows.avatar,
          owner: profileThatFollows.owner,
          name: profileThatFollows.name,
        },
      },
    },
    options,
  );
};

export const following = async (
  isArtist: boolean,
  profileThatIsFollowing: IProfileView,
  userWhoIsFollowing: string,
) => {
  const { artistFollowing, userFollowing } = await isAlreadyFollowing(
    profileThatIsFollowing.owner,
    userWhoIsFollowing,
  );

  if (isArtist) {
    if (artistFollowing && artistFollowing.artistFollowing.length > 0) {
      throw new UserInputError('Já é seguido');
    }
    await ArtistProfile.findOneAndUpdate(
      { owner: profileThatIsFollowing.owner },
      { $inc: { followers: 1 } },
      { useFindAndModify: false },
    );

    return Following.findOneAndUpdate(
      {
        username: userWhoIsFollowing,
      },
      {
        $set: {
          artistFollowing: {
            // @ts-ignore
            avatar: profileThatIsFollowing.avatar,
            owner: profileThatIsFollowing.owner,
            name: profileThatIsFollowing.name,
          },
        },
      },
      options,
    );
  }
  if (userFollowing && userFollowing.userFollowing.length > 0) {
    throw new UserInputError('Já é seguido');
  }

  await UserProfile.findOneAndUpdate(
    { owner: profileThatIsFollowing.owner },
    { $inc: { followers: 1 } },
    { useFindAndModify: false },
  );

  return Following.findOneAndUpdate(
    {
      username: userWhoIsFollowing,
    },
    {
      $set: {
        userFollowing: {
          // @ts-ignore
          avatar: profileThatIsFollowing.avatar,
          owner: profileThatIsFollowing.owner,
          name: profileThatIsFollowing.name,
        },
      },
    },
    options,
  );
};
