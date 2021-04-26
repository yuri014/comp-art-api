import bcrypt from 'bcryptjs';
import { UserInputError } from 'apollo-server-express';

import User from '../../../../entities/User';
import { validateLoginInput } from '../../../../utils/validateRegisterInput';
import generateToken from '../../../../utils/generateToken';
import handleSendConfirmationEmail from '../../../../utils/handleSendConfirmationEmail';

const loginUser = async (email: string, password: string) => {
  const { errors, valid } = validateLoginInput(email, password);

  if (!valid) {
    throw new UserInputError('Erros', {
      errors,
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    errors.general = 'Usuário não encontrado';
    throw new UserInputError('Usuário não encontrado', { errors });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!user.confirmed && match) {
    const now = new Date(new Date().toISOString()).getTime() / 60000;
    const diff = now - new Date(user?.createdAt).getTime() / 60000;

    if (diff >= 1440) {
      user.delete();
      errors.general = 'Usuário não encontrado';
      throw new UserInputError('Usuário excluído', { errors });
    }

    await handleSendConfirmationEmail(user);

    const message = 'Um email de confirmação foi enviado a você, por favor confirme seu email!';
    errors.general = message;

    throw new UserInputError('Email não confirmado', { errors });
  }

  if (!match) {
    errors.general = 'Credenciais erradas';
    throw new UserInputError('Credenciais erradas', { errors });
  }

  const token = generateToken(user, '2d');

  return {
    ...user._doc,
    id: user._id,
    token,
  };
};

export default loginUser;
