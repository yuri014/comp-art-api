import jwt from 'jsonwebtoken';

import { IToken } from '@interfaces/Token';

const getUser = (token: string) => {
  if (token) {
    return jwt.verify(token, process.env.SECRET as string) as IToken;
  }
  return {
    username: '',
  };
};

export default getUser;
