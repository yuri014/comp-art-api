import { UserInputError } from 'apollo-server-express';

import User from '../../../../../entities/User';
import { IToken } from '../../../../../interfaces/Token';
import findProfile from '../utils/findProfileUtil';
import ArtistProfile from '../../../../../entities/ArtistProfile';
import UserProfile from '../../../../../entities/UserProfile';
import shuffleArray from '../utils/shuffleProfilesArray';

export const getProfileService = async (username: string) => {
  const user = await User.findOne({ username });

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

export const searchProfilesService = async (query: string, offset: number) => {
  const artistsProfiles = await ArtistProfile.find({ $text: { $search: query } })
    .skip(offset > 0 ? Math.round(offset / 2) : offset)
    .limit(5);

  const usersProfiles = await UserProfile.find({ $text: { $search: query } })
    .skip(offset > 0 ? Math.round(offset / 2) : offset)
    .limit(5);

  return shuffleArray(artistsProfiles, usersProfiles);
};
