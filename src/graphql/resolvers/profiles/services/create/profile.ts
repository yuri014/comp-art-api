import { Model } from 'mongoose';

import { IArtistProfile, ICreateProfile, IUserProfile } from '@interfaces/Profile';
import { IToken } from '@interfaces/Token';
import { uploadImage } from '@utils/upload';
import profileValidation from '../utils/profileValidation';

const createProfile = async (
  user: IToken,
  Profile: Model<IArtistProfile> | Model<IUserProfile>,
  data: ICreateProfile,
) => {
  const { avatar, bio, coverImage, name, hashtags, links } = data;

  const validation = await profileValidation(user, name, bio, hashtags);

  const profileExists = await Profile.findOne({ owner: user.username });

  await validation(profileExists);

  const { file: avatarFile } = await avatar;
  const avatarImageUrl = await uploadImage(avatarFile?.createReadStream, avatarFile?.filename);
  const { file: coverFile } = await coverImage;
  const coverImageUrl = await uploadImage(coverFile?.createReadStream, coverFile?.filename);

  const newProfile = new Profile({
    name: name.trim(),
    avatar: avatarImageUrl,
    bio: bio.trim(),
    coverImage: coverImageUrl,
    createdAt: new Date().toISOString(),
    links,
    hashtags,
    owner: user.username,
  });

  await newProfile.save();

  return true;
};

export default createProfile;
