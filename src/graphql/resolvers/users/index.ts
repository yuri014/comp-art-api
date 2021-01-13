import bcrypt from 'bcryptjs';
import { IResolvers } from 'graphql-tools';
import { UserInputError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

import User from '../../../entities/User';
import { validateLoginInput, validateRegisterInput } from '../../../utils/validateRegisterInput';
import { IRegisterFields } from '../../../interfaces/User';
import sendEmailVerification from '../../../services/sendEmail';
import generateToken from './utils/generateToken';
import { emailConfirmationMessage, passwordRecoverMessage } from './utils/userEmailMessages';

const usersResolvers: IResolvers = {
  Mutation: {
    async register(
      _,
      {
        registerInput: { username, email, isArtist, password, confirmPassword },
      }: { registerInput: IRegisterFields },
    ) {
      const user = {
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
        confirmPassword: confirmPassword.trim(),
      };

      const errors = await validateRegisterInput(user as IRegisterFields);

      if (errors.error) {
        throw new UserInputError('Erros', {
          errors: errors.error.message,
        });
      }

      const usernameExists = await User.findOne({ username: user.username });
      const emailExists = await User.findOne({ email: user.email });

      if (usernameExists || emailExists) {
        throw new UserInputError('Username ou email já existe', {
          errors: {
            duplicate: usernameExists ? 'Username já existe' : 'Email já existe',
          },
        });
      }

      const encryptedPassword = await bcrypt.hash(user.password, 12);
      const newUser = new User({
        username: user.username,
        email: user.email,
        password: encryptedPassword,
        isArtist,
        createdAt: new Date().toISOString(),
      });

      const result = await newUser.save();

      const token = generateToken(result, '1d');

      const message = emailConfirmationMessage(
        username,
        email,
        `${process.env.FRONT_END_HOST}/confirmation-email/${token}`,
      );

      await sendEmailVerification(message);

      return true;
    },

    async login(_, { email, password }) {
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

        const token = generateToken(user, '10m');
        const message = 'Um email de confirmação foi enviado a você, por favor confirme seu email!';
        const emailMessage = emailConfirmationMessage(
          user.username,
          user.email,
          `${process.env.FRONT_END_HOST}/confirmation-email/${token}`,
        );

        await sendEmailVerification(emailMessage);
        errors.general = message;
        throw new UserInputError('Email não confirmado', { errors });
      }

      if (!match) {
        errors.general = 'Credenciais erradas';
        throw new UserInputError('Credenciais erradas', { errors });
      }

      const token = generateToken(user, '1d');

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async confirmationEmail(_, { token }: { token: string }) {
      try {
        const user = jwt.verify(token, process.env.SECRET as string) as { id: string };
        const userById = await User.findById(user.id);
        if (!userById) {
          throw new Error();
        }
        await User.updateOne({ confirmed: true });
        return userById;
      } catch (error) {
        throw new Error(error);
      }
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

        await sendEmailVerification(message);

        return true;
      }

      return false;
    },

    async recoverPassword(_, { token, newPassword }: { token: string; newPassword: string }) {
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
    },
  },
};

export default usersResolvers;
