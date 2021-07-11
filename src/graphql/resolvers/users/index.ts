import { IResolvers, UserInputError } from 'apollo-server-express';

import User from '../../../entities/User';
import { IRegisterFields } from '../../../interfaces/User';
import createUser from './services/create';
import loginUser from './services/find';
import { confirmUser, updatePassword } from './services/update';
import recoverPasswordEmail from '../../../emails/templates/recoverPasswordEmail';
import createEmail from '../../../emails/createEmail';
import sendEmail from '../../../emails/sendEmail';
import handleSendConfirmationEmail from '../../../utils/handleSendConfirmationEmail';
import generateToken from '../../../generators/generateToken';
import ConfirmationCode from '../../../entities/ConfirmationCode';
import checkAuth from '../../../middlewares/checkAuth';
import deleteUser from './services/delete';

const usersResolvers: IResolvers = {
  Mutation: {
    async register(_, { registerInput }: { registerInput: IRegisterFields }) {
      return createUser(registerInput);
    },

    async login(_, { email, password }) {
      return loginUser(email, password);
    },

    async confirmationEmail(_, { code, email }: { code: string; email: string }) {
      return confirmUser(code, email);
    },

    async sendForgotPasswordEmail(_, { email }: { email: string }) {
      const user = await User.findOne({ email }).lean();

      if (!user) {
        throw new UserInputError('Não há usuário com esse e-mail.');
      }

      const token = generateToken(user, '10m');
      const recoverPassoword = recoverPasswordEmail(
        user.username,
        `${process.env.FRONT_END_HOST}/forgot-password/${token}`,
      );

      const message = createEmail({
        recipient: email,
        subject: 'Recuperar senha',
        text: 'Recuperar senha',
        template: recoverPassoword,
        username: user.username,
      });

      await sendEmail(message);

      return true;
    },

    async recoverPassword(
      _,
      {
        token,
        newPassword,
        confirmPassword,
      }: { token: string; newPassword: string; confirmPassword: string },
    ) {
      return updatePassword(token, newPassword, confirmPassword);
    },

    async resendConfirmationCode(_, { email }: { email: string }) {
      const user = await User.findOneAndUpdate(
        { email },
        {
          $inc: {
            strikes: 1,
          },
        },
        {
          useFindAndModify: false,
          new: true,
        },
      );

      if (!user) {
        throw new UserInputError('Não há usuário com esse email');
      }

      if (user.confirmed) {
        throw new UserInputError('Seu email já foi confirmado!');
      }

      if (user.strikes >= 3) {
        user.delete();

        await ConfirmationCode.findOneAndRemove({ user: user._id }, { useFindAndModify: false });

        throw new UserInputError(
          'Talvez seu e-mail esteja errado, excluímos seu usuário para que refaça seu cadastro.',
        );
      }

      await handleSendConfirmationEmail(user);

      return true;
    },

    async deleteAccount(_, __, context) {
      const user = checkAuth(context);

      return deleteUser(user);
    },
  },
};

export default usersResolvers;
