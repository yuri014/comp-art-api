import { IProfileEntity } from '../interfaces/Models';

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
