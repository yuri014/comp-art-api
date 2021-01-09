import { IResolvers } from 'graphql-tools';

import ArtistProfile from '../../../entities/ArtistProfile';
import { ICreateProfile } from '../../../interfaces/Profile';

const profileResolvers: IResolvers = {
  Mutation: {
    async createArtistProfile(
      _,
      {
        createProfileInput: { name, avatar, bio, coverImage },
      }: { createProfileInput: ICreateProfile },
    ) {
      const newProfile = new ArtistProfile({
        name,
        avatar,
        bio,
        coverImage,
        createdAt: new Date().toISOString(),
      });

      const result = await newProfile.save();

      return {
        ...result._doc,
        id: result._id,
      };
    },
  },
};

export default profileResolvers;
