import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserInputError } from 'apollo-server-express';

import User from '../../../../entities/User';
import ConfirmationCode from '../../../../entities/ConfirmationCode';

export const confirmUser = async (code: string, email: string) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new UserInputError('Não há usuário com esse email!');
    }

    const confirmationCode = await ConfirmationCode.findOne({
      user: user?._id,
      code,
    });

    if (!confirmationCode) {
      throw new UserInputError('Oops... Código incorreto, tente novamente!');
    }

    const userById = await User.findByIdAndUpdate(
      user.id,
      { confirmed: true },
      { useFindAndModify: false },
    );
    if (!userById) {
      throw new Error();
    }
    return userById;
  } catch (error) {
    throw new Error(error);
  }
};

export const updatePassword = async (token: string, newPassword: string) => {
  try {
    const { id } = jwt.verify(token, process.env.SECRET as string) as { id: string };
    const user = User.findById(id);
    const encryptedPassword = await bcrypt.hash(newPassword, 12);
    if (user) {
      await User.updateOne({ password: encryptedPassword });
    }
    return token;
  } catch (error) {
    throw new Error(error);
  }
};
