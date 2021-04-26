import { IResolvers } from 'apollo-server-express';

import User from '../../../entities/User';
import { IRegisterFields } from '../../../interfaces/User';
import generateToken from '../../../utils/generateToken';
import createUser from './services/create';
import loginUser from './services/find';
import { confirmUser, updatePassword } from './services/update';
import sendEmail from '../../../utils/sendEmail';
import recoverPasswordEmail from '../../../emails/templates/recoverPasswordEmail';
import createEmail from '../../../emails/createEmail';

const usersResolvers: IResolvers = {
  Mutation: {
    async register(_, { registerInput }: { registerInput: IRegisterFields }) {
      return createUser(registerInput);
    },

    async login(_, { email, password }) {
      return loginUser(email, password);
    },

    async confirmationEmail(_, { token }: { token: string }) {
      return confirmUser(token);
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
  },
};

export default usersResolvers;
