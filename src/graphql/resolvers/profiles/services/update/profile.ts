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

  if (oldProfile.avatar !== '') {
    await removeFile(oldProfile.avatar);
  }

  if (oldProfile.coverImage !== '') {
    await removeFile(oldProfile.coverImage);
  }

  const { avatarImageUrl, coverImageUrl } = await uploadProfileFiles(avatar, coverImage);

  const newBio = bio ? bio.trim() : '';

  await oldProfile.updateOne({
    name: name.trim(),
    bio: newBio,
    hashtags,
    links,
    avatar: avatarImageUrl || oldProfile.avatar,
    coverImage: coverImageUrl || oldProfile.coverImage,
  });

  return true;
};

export default updateProfileService;
