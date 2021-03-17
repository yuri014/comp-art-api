import { UserInputError } from 'apollo-server-express';
import ArtistProfile from '../../../../entities/ArtistProfile';
import Follower from '../../../../entities/Follower';
import Following from '../../../../entities/Following';
import UserProfile from '../../../../entities/UserProfile';
import { IArtistProfile, IProfileView, IUserProfile } from '../../../../interfaces/Profile';
import { isAlreadyFollow, isAlreadyFollowing } from '../../../../middlewares/isAlreadyFollow';

const options = {
  new: true,
  useFindAndModify: false,
};

export const unfollower = async (
  isArtist: boolean,
  profileThatFollows: IArtistProfile | IUserProfile,
  userWhoIsFollowed: string,
) => {
  const { artistFollower, userFollower } = await isAlreadyFollow(
    profileThatFollows.owner,
    userWhoIsFollowed,
  );

  if (isArtist) {
    // @ts-ignore
    if (artistFollower.artistFollowers.lenght) {
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
      options,
    );
  }

  // @ts-ignore
  if (userFollower.userFollowers.lenght) {
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

  if (!artistFollowing && !userFollowing) {
    throw new UserInputError('Não segue ninguém');
  }

  if (isArtist) {
    // @ts-ignore
    if (artistFollowing.artistFollowing.lenght) {
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
      options,
    );
  }

  // @ts-ignore
  if (userFollowing.userFollowing.lenght) {
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
        userFollowing: profileThatIsFollowing._id,
      },
    },
    options,
  );
};
