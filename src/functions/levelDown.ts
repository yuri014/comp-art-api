import { IProfileEntity } from '../interfaces/Models';

const levelDown = async (profile: IProfileEntity, xp: number) => {
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
        xp: -xp,
      },
    });
    return false;
  }

  if (profile.level === 1) {
    await profile.updateOne({
      $inc: {
        xp: -xp,
      },
    });

    return false;
  }

  return false;
};

export default levelDown;
