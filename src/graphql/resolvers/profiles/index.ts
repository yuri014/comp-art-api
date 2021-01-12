import jwt from 'jsonwebtoken';
import { IResolvers } from 'graphql-tools';
import { UserInputError } from 'apollo-server-express';

import ArtistProfile from '../../../entities/ArtistProfile';
import { ICreateProfile } from '../../../interfaces/Profile';
import User from '../../../entities/User';
import uploadImage from '../../../utils/uploadImage';

const profileResolvers: IResolvers = {
  Mutation: {
    async createArtistProfile(
      _,
      {
        createProfileInput: { name, avatar, bio, coverImage, token },
      }: { createProfileInput: ICreateProfile },
    ) {
      const { id } = jwt.verify(token, process.env.SECRET as string) as { id: string };

      const profileExists = await ArtistProfile.findOne({ owner: id });

      if (profileExists) {
        throw new UserInputError('Usuário já é dono de um perfil', {
          errors: 'Usuário já é dono de um perfil',
        });
      }

      const avatarFile = await avatar;
      const avatarImageUrl = uploadImage(avatarFile?.createReadStream, avatarFile?.filename);
      const coverFile = await coverImage;
      const coverImageUrl = uploadImage(coverFile?.createReadStream, coverFile?.filename);

      const newProfile = new ArtistProfile({
        name,
        avatar: avatarImageUrl,
        bio,
        coverImage: coverImageUrl,
        createdAt: new Date().toISOString(),
        owner: id,
      });

      const user = await User.findById(id);

      if (!user) {
        throw new UserInputError('Usuário não encontrado', {
          errors: 'Usuário não encontrado',
        });
      }

      await newProfile.save();

      return {
        ...newProfile._doc,
      };
    },
  },
};

export default profileResolvers;
