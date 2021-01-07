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
    async register(_, { registerInput: { username, email, password, confirmPassword } }) {
      const user = { username, email, password, confirmPassword };
      const { errors, valid } = validateRegisterInput(user as IRegisterFields);

      if (!valid) {
        throw new UserInputError('Erros', {
          errors,
        });
      }

      const usernameExists = await User.findOne({ username });
      const emailExists = await User.findOne({ email });

      if (usernameExists || emailExists) {
        throw new UserInputError('Username ou email já existe', {
          errors: {
            duplicate: usernameExists ? 'Username já existe' : 'Email já existe',
          },
        });
      }

      const encryptedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        username,
        email,
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
