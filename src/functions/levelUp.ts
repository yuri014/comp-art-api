import { IProfileEntity } from '../interfaces/Models';

/**
 * Calcula o xp necessaŕio para aumentar o level do usuário
 * @returns true se o usuário subiu de level
 * @returns false se o usuário só ganhou xp, mantendo o level
 */
const levelUp = async (profile: IProfileEntity) => {
  const targetXp = 1000 * profile.level * 1.25;

  if (profile.xp >= targetXp) {
    await profile.updateOne({
      xp: profile.xp - targetXp,
      $inc: {
        level: 1,
      },
    });
    return true;
  }

  return false;
};

export default levelUp;
