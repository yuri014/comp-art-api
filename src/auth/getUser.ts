import { UserInputError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import { IToken } from '../interfaces/Token';

const getUser = (token: string) => {
  if (!token) {
    throw new UserInputError('Não possui acesso.');
  }

  return jwt.verify(token, process.env.SECRET as string) as IToken;
};

export default getUser;
