import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserInputError } from 'apollo-server-express';

import User from '../../../../entities/User';
import ConfirmationCode from '../../../../entities/ConfirmationCode';
import generateToken from '../../../../generators/generateToken';
import { userValidator } from '../../../../validators/userSchema';
import { ID } from '../../../../interfaces/General';

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

  await confirmationCode.deleteOne();

  const token = generateToken(user, '15d');

  return {
    id: user._id,
    token,
    username: user.username,
    isArtist: user.isArtist,
  };
};

export const updatePassword = async (token: string, password: string, confirmPassword: string) => {
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET as string) as ID;
    const user = await User.findById(decodedToken.id);

    if (!user) {
      throw new UserInputError('Não existe usuário');
    }

    const userValidation = userValidator();

    const errors = userValidation.validate({ password, confirmPassword });

    if (errors.error) {
      throw new UserInputError(errors.error.message);
    }

    const encryptedPassword = await bcrypt.hash(password, 12);
    await user.updateOne({ password: encryptedPassword }, { useFindAndModify: false });

    return true;
  } catch (error) {
    throw new UserInputError('Token inválida');
  }
};
