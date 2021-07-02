import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserInputError } from 'apollo-server-express';

import User from '../../../../entities/User';
import { ID } from '../../../../interfaces/General';
import ConfirmationCode from '../../../../entities/ConfirmationCode';
import generateToken from '../../../../generators/generateToken';

export const confirmUser = async (code: string, email: string) => {
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

  const token = generateToken(user, '15d');

  return {
    id: user._id,
    token,
    username: user.username,
    isArtist: user.isArtist,
  };
};

export const updatePassword = async (token: string, newPassword: string) => {
  const { id } = jwt.verify(token, process.env.SECRET as string) as ID;
  const user = await User.findById(id);

  if (user) {
    throw new UserInputError('Não existe usuário');
  }

  const encryptedPassword = await bcrypt.hash(newPassword, 12);
  await User.updateOne({ password: encryptedPassword });

  return token;
};
