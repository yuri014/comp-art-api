import ArtistProfile from '../../../../entities/ArtistProfile';
import Follower from '../../../../entities/Follower';
import Following from '../../../../entities/Following';
import UserProfile from '../../../../entities/UserProfile';
import { IArtistProfile, IUserProfile } from '../../../../interfaces/Profile';

const options = {
  new: true,
  useFindAndModify: false,
};

export const unfollower = async (
  isArtist: boolean,
  profileThatFollows: IUserProfile | IArtistProfile,
  userWhoIsFollowed: string,
) => {
  if (isArtist) {
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
  profileThatIsFollowing: IUserProfile | IArtistProfile,
  userWhoIsFollowing: string,
) => {
  if (isArtist) {
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
