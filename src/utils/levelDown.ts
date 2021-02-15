import { IArtistProfile, IUserProfile } from '../interfaces/Profile';

const levelDown = async (profile: IArtistProfile | IUserProfile, xp: number) => {
  const previousTargetXp = 1000 * (profile.level - 1) * 1.25;
  const targetXp = 1000 * profile.level * 1.25;

  if (profile.xp < xp && profile.xp < targetXp) {
    await profile.updateOne({
      $inc: {
        xp: previousTargetXp - xp,
        level: -1,
      },
    });

    return true;
  }

  if (profile.xp < targetXp && profile.level > 1) {
    await profile.updateOne({
      $inc: {
        level: -1,
        xp: -xp,
      },
    });
    return true;
  }

  if (profile.level === 1) {
    await profile.updateOne({
      $inc: {
        xp: -xp,
      },
    });

    return true;
  }

  return false;
};

export default levelDown;
