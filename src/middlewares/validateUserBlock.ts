import { UserInputError } from 'apollo-server-express';
import { differenceInDays } from 'date-fns';

import { IUser } from '../interfaces/User';

const validateUserBlock = async (user: IUser) => {
  if (user.blockUntil) {
    const now = new Date(new Date().toISOString());
    const blockUntil = new Date(user.createdAt);
    const daysBetweenDates = differenceInDays(now, blockUntil);

    if (daysBetweenDates <= 7) {
      throw new UserInputError(
        'Você excedeu o limite de tentativas, sua conta está bloqueada por uma semana',
      );
    } else {
      await user.updateOne({ blockUntil: '' }, { useFindAndModify: false });
    }
  }
};

export default validateUserBlock;
