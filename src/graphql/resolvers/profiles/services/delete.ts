import { UserInputError } from 'apollo-server-express';

import ArtistProfile from '../../../../entities/ArtistProfile';
import Follower from '../../../../entities/Follower';
import Following from '../../../../entities/Following';
import UserProfile from '../../../../entities/UserProfile';
import { IProfileEntity } from '../../../../interfaces/Models';
import { isAlreadyFollow, isAlreadyFollowing } from '../../../../middlewares/isAlreadyFollow';
import genericUpdateOptions from '../../../../utils/genericUpdateOptions';

export const unfollower = async (
  isArtist: boolean,
  profileThatFollows: IProfileEntity,
  userWhoIsFollowed: string,
) => {
  const { artistFollower, userFollower } = await isAlreadyFollow(
    profileThatFollows._id,
    userWhoIsFollowed,
  );

  if (isArtist) {
    if (artistFollower && artistFollower.artistFollowers.length === 0) {
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
          artistFollowers: profileThatFollows._id,
        },
      },
      genericUpdateOptions,
    );
  }

  // @ts-ignore
  if (userFollower.userFollowers.length === 0) {
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
        userFollowers: profileThatFollows._id,
      },
    },
    genericUpdateOptions,
  );
};

export const unfollowing = async (
  isArtist: boolean,
  profileThatIsFollowing: IProfileEntity,
  userWhoIsFollowing: string,
) => {
  const { artistFollowing, userFollowing } = await isAlreadyFollowing(
    profileThatIsFollowing._id,
    userWhoIsFollowing,
  );

  if (!artistFollowing && !userFollowing) {
    throw new UserInputError('Não segue ninguém');
  }

  if (isArtist) {
    // @ts-ignore
    if (artistFollowing.artistFollowing.length === 0) {
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
          artistFollowing: profileThatIsFollowing._id,
        },
      },
      genericUpdateOptions,
    );
  }

  // @ts-ignore
  if (userFollowing.userFollowing.length === 0) {
    throw new UserInputError('Não é seguido 300');
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
        userFollowing: profileThatIsFollowing._id,
      },
    },
    genericUpdateOptions,
  );
};
