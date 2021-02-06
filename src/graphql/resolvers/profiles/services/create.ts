import { UserInputError } from 'apollo-server-express';
import { Model } from 'mongoose';

import { IArtistProfile, ICreateProfile, IUserProfile } from '../../../../interfaces/Profile';
import { IToken } from '../../../../interfaces/Token';
import { uploadImage } from '../../../../utils/upload';

const createProfile = async (
  user: IToken,
  Profile: Model<IArtistProfile> | Model<IUserProfile>,
  data: ICreateProfile,
) => {
  const profileExists = await Profile.findOne({ owner: user.username });

  const { avatar, bio, coverImage, name, hashtags, links } = data;

  if (profileExists) {
    throw new UserInputError('Usuário já é dono de um perfil', {
      errors: 'Usuário já é dono de um perfil',
    });
  }

  const hashtagsLength = data.hashtags.length;

  if (hashtagsLength > 5 || hashtagsLength !== new Set(data.hashtags).size) {
    throw new UserInputError('Limite de 5 hashtags não repetidas', {
      errors: 'Limite de 5 hashtags não repetidas',
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
    links,
    hashtags,
    owner: user.username,
  });

  await newProfile.save();
};

export default createProfile;
