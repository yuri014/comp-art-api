import { IProfileEntity } from '../interfaces/Models';

/**
 * Calcula o xp perdido e, se for necessaŕio, diminui o level do usuário.
 * @returns true se o usuário perdeu algum level
 * @returns false se o usuário só perdeu xp, mantendo no mesmo level
 */
const levelDown = async (profile: IProfileEntity, xp: number) => {
  const xpMultiplier = 1.25;
  const previousLevel = profile.level - 1;
  const magnitudeParam = 1000;

  const previousTargetXp = magnitudeParam * previousLevel * xpMultiplier;
  const targetXp = magnitudeParam * profile.level * xpMultiplier;

  if (profile.xp < xp && profile.xp < targetXp) {
    profile.updateOne({
      $inc: {
        xp: previousTargetXp - xp,
        level: -1,
      },
    });

    return true;
  }

  if (profile.xp < targetXp && profile.level > 1) {
    profile.updateOne({
      $inc: {
        xp: -xp,
      },
    });
    return false;
  }

  if (profile.level === 1) {
    profile.updateOne({
      $inc: {
        xp: -xp,
      },
    });

    return false;
  }

  return false;
};

export default levelDown;
