import { UserInputError } from 'apollo-server-express';
import { Model } from 'mongoose';

import { IToken } from '../../../../../interfaces/Token';
import removeFile from '../../../../../utils/removeFile';
import { IArtistProfile, ICreateProfile, IUserProfile } from '../../../../../interfaces/Profile';
import uploadProfileFiles from '../utils/uploadProfileFiles';

const updateProfileService = async (
  user: IToken,
  Profile: Model<IArtistProfile> | Model<IUserProfile>,
  data: ICreateProfile,
) => {
  const oldProfile = await Profile.findOne({ owner: user.username });

  if (!oldProfile) {
    throw new UserInputError('Não há perfil');
  }

  const { avatar, bio, coverImage, name, hashtags, links } = data;

  if (avatar && oldProfile.avatar !== '') {
    await removeFile(oldProfile.avatar);
  }

  if (coverImage && oldProfile.coverImage !== '') {
    await removeFile(oldProfile.coverImage);
  }

  const { getAvatarUrl, getCoverImageUrl } = await uploadProfileFiles(avatar, coverImage);

  const avatarUrl = avatar ? await getAvatarUrl() : oldProfile.avatar;
  const coverImageUrl = coverImage ? await getCoverImageUrl() : oldProfile.coverImage;

  const newBio = bio ? bio.trim() : '';

  await oldProfile.updateOne({
    name: name.trim(),
    bio: newBio,
    hashtags,
    links,
    avatar: avatarUrl,
    coverImage: coverImageUrl,
  });

  return true;
};

export default updateProfileService;
