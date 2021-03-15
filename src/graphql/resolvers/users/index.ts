import { IResolvers } from 'apollo-server-express';

import User from '../../../entities/User';
import { IRegisterFields } from '../../../interfaces/User';
import { passwordRecoverMessage } from '../../../emails/userEmailMessages';
import generateToken from '../../../utils/generateToken';
import createUser from './services/create';
import loginUser from './services/find';
import { confirmUser, updatePassword } from './services/update';
import sendEmail from '../../../utils/sendEmail';

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
        const message = passwordRecoverMessage(
          user.username,
          email,
          `${process.env.FRONT_END_HOST}/recover-password/${token}`,
        );

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
