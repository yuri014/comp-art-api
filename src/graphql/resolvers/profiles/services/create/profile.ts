import { Model } from 'mongoose';

import { IArtistProfile, ICreateProfile, IUserProfile } from '../../../../../interfaces/Profile';
import { IToken } from '../../../../../interfaces/Token';
import profileValidation from '../utils/profileValidation';
import uploadProfileFiles from '../utils/uploadProfileFiles';

const createProfile = async (
  user: IToken,
  Profile: Model<IArtistProfile> | Model<IUserProfile>,
  data: ICreateProfile,
) => {
  const { avatar, bio, coverImage, name, hashtags, links } = data;

  const validation = await profileValidation(user, name, bio, hashtags);

  const profileExists = await Profile.findOne({ owner: user.username });

  await validation(profileExists);

  const { getAvatarUrl, getCoverImageUrl } = await uploadProfileFiles(avatar, coverImage);

  const avatarUrl = avatar ? await getAvatarUrl() : '';
  const coverImageUrl = coverImage ? await getCoverImageUrl() : '';

  const newProfile = new Profile({
    name: name.trim(),
    avatar: avatarUrl,
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
