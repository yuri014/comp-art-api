import { UserInputError } from 'apollo-server-express';
import { Model } from 'mongoose';

import { IToken } from '../../../../../interfaces/Token';
import removeFile from '../../../../../utils/removeFile';
import { uploadImage } from '../../../../../utils/upload';
import { IArtistProfile, ICreateProfile, IUserProfile } from '../../../../../interfaces/Profile';

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

  if (oldProfile.avatar !== '' && oldProfile.coverImage !== '') {
    await removeFile(oldProfile.avatar);
    await removeFile(oldProfile.coverImage);
  }

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

export default updateProfileService;
