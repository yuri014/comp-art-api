import { IResolvers } from 'graphql-tools';
import { UserInputError } from 'apollo-server-express';

import ArtistProfile from '../../../entities/ArtistProfile';
import { ICreateProfile } from '../../../interfaces/Profile';
import uploadImage from '../../../utils/uploadImage';
import checkAuth from '../../../middlewares/checkAuth';

const profileResolvers: IResolvers = {
  Mutation: {
    async createArtistProfile(
      _,
      {
        createProfileInput: { name, avatar, bio, coverImage },
      }: { createProfileInput: ICreateProfile },
      context,
    ) {
      const user = checkAuth(context);

      const profileExists = await ArtistProfile.findOne({ owner: user.id });

      if (profileExists) {
        throw new UserInputError('Usuário já é dono de um perfil', {
          errors: 'Usuário já é dono de um perfil',
        });
      }

      const { file: avatarFile } = await avatar;
      const avatarImageUrl = await uploadImage(avatarFile?.createReadStream, avatarFile?.filename);
      const { file: coverFile } = await coverImage;
      const coverImageUrl = await uploadImage(coverFile?.createReadStream, coverFile?.filename);

      if (!user) {
        throw new UserInputError('Usuário não encontrado', {
          errors: 'Usuário não encontrado',
        });
      }

      const newProfile = new ArtistProfile({
        name,
        avatar: avatarImageUrl,
        bio,
        coverImage: coverImageUrl,
        createdAt: new Date().toISOString(),
        owner: user.id,
      });

      await newProfile.save();

      return true;
    },
  },
};

export default profileResolvers;
