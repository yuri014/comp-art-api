import bcrypt from 'bcryptjs';
import { UserInputError } from 'apollo-server-express';

import { differenceInDays } from 'date-fns';
import User from '../../../../entities/User';
import handleSendConfirmationEmail from '../../../../utils/handleSendConfirmationEmail';
import { validateLoginInput } from '../../../../validators/utils/validateRegisterInput';
import generateToken from '../../../../generators/generateToken';

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
    const now = new Date(new Date().toISOString());
    const userCreatedAt = new Date(user?.createdAt);
    const limitDaysForConfirm = 2;
    const daysBetweenDates = differenceInDays(now, userCreatedAt);

    if (daysBetweenDates >= limitDaysForConfirm) {
      user.delete();
      throw new UserInputError('Usuário excluído, refaça seu cadastro');
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
