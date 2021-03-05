import { IArtistProfile, IUserProfile } from '../../../../../interfaces/Profile';

const shuffleArray = (artists: Array<IArtistProfile>, users: Array<IUserProfile>) => {
  const profiles = artists.concat(users as []);

  const shuffledProfiles = profiles.sort(() => Math.random() - 0.5);

  return shuffledProfiles;
};

export default shuffleArray;
