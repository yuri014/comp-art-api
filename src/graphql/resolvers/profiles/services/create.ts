import { UserInputError } from 'apollo-server-express';
import { Model } from 'mongoose';

import { IArtistProfile, ICreateProfile, IUserProfile } from '../../../../interfaces/Profile';
import { IToken } from '../../../../interfaces/Token';
import uploadImage from '../../../../utils/uploadImage';

const createProfile = async (
  user: IToken,
  Profile: Model<IArtistProfile> | Model<IUserProfile>,
  data: ICreateProfile,
) => {
  const profileExists = await Profile.findOne({ owner: user.id });

  const { avatar, bio, coverImage, name } = data;

  if (profileExists) {
    throw new UserInputError('Usuário já é dono de um perfil', {
      errors: 'Usuário já é dono de um perfil',
    });
  }

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
    owner: user.username,
  });

  await newProfile.save();
};

export default createProfile;
