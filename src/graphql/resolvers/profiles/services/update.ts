import { UserInputError } from 'apollo-server-express';
import ArtistProfile from '../../../../entities/ArtistProfile';
import Follower from '../../../../entities/Follower';
import Following from '../../../../entities/Following';
import UserProfile from '../../../../entities/UserProfile';
import { IArtistProfile, IUserProfile } from '../../../../interfaces/Profile';

const options = {
  upsert: true,
  new: true,
  setDefaultsOnInsert: true,
  useFindAndModify: false,
};

export const follower = async (
  isArtist: boolean,
  profileThatFollows: IUserProfile | IArtistProfile,
  userWhoIsFollowed: string,
) => {
  if (isArtist) {
    const isAlreadyFollow = await Follower.findOne({ artistFollowers: profileThatFollows });

    if (isAlreadyFollow) {
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
            avatar: profileThatFollows.avatar,
            owner: profileThatFollows.owner,
            name: profileThatFollows.name,
          },
        },
      },
      options,
    );
  }

  const isAlreadyFollow = await Follower.findOne({ userFollowers: profileThatFollows });

  if (isAlreadyFollow) {
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
  profileThatIsFollowing: IUserProfile | IArtistProfile,
  userWhoIsFollowing: string,
) => {
  if (isArtist) {
    const isAlreadyFollow = await Following.findOne({ userFollowing: profileThatIsFollowing });

    if (isAlreadyFollow) {
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
            avatar: profileThatIsFollowing.avatar,
            owner: profileThatIsFollowing.owner,
            name: profileThatIsFollowing.name,
          },
        },
      },
      options,
    );
  }

  const isAlreadyFollow = await Following.findOne({ artistFollowing: profileThatIsFollowing });

  if (isAlreadyFollow) {
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
          avatar: profileThatIsFollowing.avatar,
          owner: profileThatIsFollowing.owner,
          name: profileThatIsFollowing.name,
        },
      },
    },
    options,
  );
};
