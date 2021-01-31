import { UserInputError } from 'apollo-server-express';
import ArtistProfile from '../../../../entities/ArtistProfile';
import Follower from '../../../../entities/Follower';
import Following from '../../../../entities/Following';
import UserProfile from '../../../../entities/UserProfile';
import { IProfileView } from '../../../../interfaces/Profile';
import { isAlreadyFollow, isAlreadyFollowing } from '../../../../middlewares/isAlreadyFollow';

const options = {
  new: true,
  useFindAndModify: false,
};

export const unfollower = async (
  isArtist: boolean,
  profileThatFollows: IProfileView,
  userWhoIsFollowed: string,
) => {
  const { artistFollower, userFollower } = await isAlreadyFollow(
    profileThatFollows.owner,
    userWhoIsFollowed,
  );

  if (isArtist) {
    if (!artistFollower) {
      throw new UserInputError('Não é seguido');
    }

    await ArtistProfile.findOneAndUpdate(
      { owner: profileThatFollows.owner },
      { $inc: { following: -1 } },
      { useFindAndModify: false },
    );

    return Follower.findOneAndUpdate(
      { username: userWhoIsFollowed },
      {
        $pull: {
          // @ts-ignore
          artistFollowers: {
            avatar: profileThatFollows.avatar,
            owner: profileThatFollows.owner,
            name: profileThatFollows.name,
          },
        },
      },
      options,
    );
  }

  if (!userFollower) {
    throw new UserInputError('Não é seguido');
  }

  await UserProfile.findOneAndUpdate(
    { owner: profileThatFollows.owner },
    { $inc: { following: -1 } },
    { useFindAndModify: false },
  );

  return Follower.findOneAndUpdate(
    { username: userWhoIsFollowed },
    {
      $pull: {
        // @ts-ignore
        userFollowers: {
          avatar: profileThatFollows.avatar,
          owner: profileThatFollows.owner,
          name: profileThatFollows.name,
        },
      },
    },
    options,
  );
};

export const unfollowing = async (
  isArtist: boolean,
  profileThatIsFollowing: IProfileView,
  userWhoIsFollowing: string,
) => {
  const { artistFollowing, userFollowing } = await isAlreadyFollowing(
    profileThatIsFollowing.owner,
    userWhoIsFollowing,
  );

  if (isArtist) {
    if (!artistFollowing) {
      throw new UserInputError('Já é seguido');
    }

    await ArtistProfile.findOneAndUpdate(
      { owner: profileThatIsFollowing.owner },
      { $inc: { followers: -1 } },
      { useFindAndModify: false },
    );

    return Following.findOneAndUpdate(
      {
        username: userWhoIsFollowing,
      },
      {
        $pull: {
          // @ts-ignore
          artistFollowing: {
            avatar: profileThatIsFollowing.avatar,
            owner: profileThatIsFollowing.owner,
            name: profileThatIsFollowing.name,
          },
        },
      },
      options,
    );
  }

  if (!userFollowing) {
    throw new UserInputError('Não é seguido');
  }

  await UserProfile.findOneAndUpdate(
    { owner: profileThatIsFollowing.owner },
    { $inc: { followers: -1 } },
    { useFindAndModify: false },
  );

  return Following.findOneAndUpdate(
    {
      username: userWhoIsFollowing,
    },
    {
      $pull: {
        // @ts-ignore
        userFollowing: {
          avatar: profileThatIsFollowing.avatar,
          owner: profileThatIsFollowing.owner,
          name: profileThatIsFollowing.name,
        },
      },
    },
    options,
  );
};
