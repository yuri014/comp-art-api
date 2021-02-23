import { UserInputError } from 'apollo-server-express';
import { Model } from 'mongoose';

import ArtistProfile from '../../../../entities/ArtistProfile';
import Follower from '../../../../entities/Follower';
import Following from '../../../../entities/Following';
import UserProfile from '../../../../entities/UserProfile';
import { IArtistProfile, ICreateProfile, IUserProfile } from '../../../../interfaces/Profile';
import { IToken } from '../../../../interfaces/Token';
import { isAlreadyFollow, isAlreadyFollowing } from '../../../../middlewares/isAlreadyFollow';
import removeFile from '../../../../utils/removeFile';
import { uploadImage } from '../../../../utils/upload';

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

export const updateProfileService = async (
  user: IToken,
  Profile: Model<IArtistProfile> | Model<IUserProfile>,
  data: ICreateProfile,
) => {
  const oldProfile = await Profile.findOne({ owner: user.username });

  if (!oldProfile) {
    throw new UserInputError('Não há perfil');
  }

  const { avatar, bio, coverImage, name, hashtags, links } = data;

  await removeFile(oldProfile.avatar);
  await removeFile(oldProfile.coverImage);
  const { file: avatarFile } = await avatar;
  const avatarImageUrl = await uploadImage(avatarFile?.createReadStream, avatarFile?.filename);
  const { file: coverFile } = await coverImage;
  const coverImageUrl = await uploadImage(coverFile?.createReadStream, coverFile?.filename);

  await oldProfile.updateOne({
    bio: bio.trim(),
    name: name.trim(),
    hashtags,
    links,
    avatar: avatarImageUrl,
    coverImage: coverImageUrl,
  });

  return true;
};
