import bcrypt from 'bcryptjs';
import { UserInputError } from 'apollo-server-express';
import { differenceInDays } from 'date-fns';

import User from '../../../../entities/User';
import generateToken from '../../../../generators/generateToken';
import handleSendConfirmationEmail from '../../../../utils/handleSendConfirmationEmail';
import { validateLoginInput } from '../../../../validators/utils/validateRegisterInput';

const loginUser = async (email: string, password: string) => {
  const { error, valid } = validateLoginInput(email, password);

  if (!valid) {
    throw new UserInputError(error);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UserInputError('Usuário não encontrado');
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

    throw new UserInputError(message);
  }

  if (!match) {
    throw new UserInputError('Credenciais erradas');
  }

  const token = generateToken(user, '7d');

  return {
    ...user._doc,
    id: user._id,
    token,
  };
};

export default loginUser;
