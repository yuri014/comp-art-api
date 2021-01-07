import bcrypt from 'bcryptjs';
import { IResolvers } from 'graphql-tools';
import { UserInputError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

import User from '../../../entities/User';
import { validateLoginInput, validateRegisterInput } from '../../../utils/validateRegisterInput';
import { IRegisterFields } from '../../../interfaces/User';
import sendEmailVerification from '../../../services/sendEmail';
import generateToken, { generateRecoverPasswordToken } from './utils/generateToken';
import emailConfirmationMessage from './utils/emailConfirmationMessage';

const usersResolvers: IResolvers = {
  Mutation: {
    async register(
      _,
      {
        registerInput: { username, email, password, confirmPassword },
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
        createdAt: new Date().toISOString(),
      });

      const result = await newUser.save();

      const token = generateToken(result);

      const message = emailConfirmationMessage(
        username,
        email,
        `${process.env.FRONT_END_HOST}/confirmation-email/${token}`,
      );

      await sendEmailVerification(message);

      return {
        ...result._doc,
        id: result._id,
        token,
      };
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

      if (!user.confirmed) {
        errors.general = 'Email não confirmado';
        throw new UserInputError('Email não confirmado', { errors });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.general = 'Credenciais erradas';
        throw new UserInputError('Credenciais erradas', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    async confirmationEmail(_, { token }: { token: string }) {
      try {
        const user: any = jwt.verify(token, process.env.SECRET as string);
        const userId = await User.findById(user.id);
        if (userId) {
          await User.updateOne({ confirmed: true });
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },
  },
};

export default usersResolvers;
