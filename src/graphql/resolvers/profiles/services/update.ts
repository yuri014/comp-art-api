import Follower from '../../../../entities/Follower';
import Following from '../../../../entities/Following';
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
