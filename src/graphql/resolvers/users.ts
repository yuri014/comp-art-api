import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IResolvers } from 'graphql-tools';
import { UserInputError } from 'apollo-server-express';

import User from '../../entities/User';
import { validateLoginInput, validateRegisterInput } from '../../utils/validateRegisterInput';
import { IRegisterFields, IUser } from '../../interfaces/User';

const generateToken = (result: IUser) =>
  jwt.sign(
    { id: result.id, email: result.email, username: result.username },
    process.env.SECRET as string,
    {
      expiresIn: '1d',
    },
  );

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

      return {
        ...result._doc,
        id: result._id,
        token,
      };
    },

    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      if (!valid) {
        throw new UserInputError('Erros', {
          errors,
        });
      }

      const user = await User.findOne({ username });

      if (!user) {
        errors.general = 'Usuário não encontrado';
        throw new UserInputError('Usuário não encontrado', { errors });
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
  },
};

export default usersResolvers;
