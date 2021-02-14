import { IArtistProfile, IUserProfile } from '../interfaces/Profile';

const levelDown = async (profile: IArtistProfile | IUserProfile) => {
  const previousTargetXp = 1000 * profile.level * 1.25;

  if (profile.xp < previousTargetXp && profile.level > 1) {
    await profile.updateOne({
      $inc: {
        level: -1,
      },
    });
    return true;
  }

  return false;
};

export default levelDown;
