import { UserInputError } from 'apollo-server-express';

import User from '../../../../../entities/User';
import { IToken } from '../../../../../interfaces/Token';
import ArtistProfile from '../../../../../entities/ArtistProfile';
import UserProfile from '../../../../../entities/UserProfile';
import findProfile from '../utils/findProfileUtil';
import shuffleProfileArray from '../utils/shuffleProfilesArray';

export const getProfileService = async (username: string) => {
  const user = await User.findOne({ username }).lean();

  if (!user) {
    throw new UserInputError('Usuário não encontrado');
  }

  const profile = await findProfile(user);

  return { ...profile._doc, isArtist: profile.isArtist };
};

export const getLoggedProfileService = async (user: IToken) => {
  const profile = await findProfile(user);

  const profileView = profile._doc;

  if (!profileView) {
    throw new Error();
  }

  const targetXp = 1000 * profileView.level * 1.25;

  profileView.xp = Math.floor((profileView.xp / targetXp) * 100);

  return { ...profileView, isArtist: profile.isArtist };
};

export const searchProfilesService = async (query: string, offset: number, limit: number) => {
  if (query.length > 0) {
    const artistsProfiles = await ArtistProfile.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { owner: { $regex: query, $options: 'i' } },
      ],
    })
      .skip(offset > 0 ? Math.round(offset / 2) : offset)
      .limit(limit);

    const usersProfiles = await UserProfile.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { owner: { $regex: query, $options: 'i' } },
      ],
    })
      .skip(offset > 0 ? Math.round(offset / 2) : offset)
      .limit(limit);

    return shuffleProfileArray(artistsProfiles, usersProfiles);
  }

  return [];
};
