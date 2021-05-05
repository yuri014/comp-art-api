import { IResolvers, UserInputError } from 'apollo-server-express';

import User from '@entities/User';
import { IRegisterFields } from '@interfaces/User';
import createUser from './services/create';
import loginUser from './services/find';
import { confirmUser, updatePassword } from './services/update';
import recoverPasswordEmail from '@emails/templates/recoverPasswordEmail';
import createEmail from '@emails/createEmail';
import sendEmail from '@emails/sendEmail';
import handleSendConfirmationEmail from '@utils/handleSendConfirmationEmail';
import generateToken from '@generators/generateToken';

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
      const user = await User.findOne({ email });

      if (user) {
        const token = generateToken(user, '10m');
        const recoverPassoword = recoverPasswordEmail(
          user.username,
          `${process.env.FRONT_END_HOST}/recover-password/${token}`,
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
      }

      return false;
    },

    async recoverPassword(_, { token, newPassword }: { token: string; newPassword: string }) {
      return updatePassword(token, newPassword);
    },

    async resendConfirmationCode(_, { email }: { email: string }) {
      const user = await User.findOne({ email });

      if (!user) {
        throw new UserInputError('Não há usuário com esse email');
      }

      await handleSendConfirmationEmail(user);

      return true;
    },
  },
};

export default usersResolvers;
