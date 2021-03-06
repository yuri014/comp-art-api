import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';
import { IToken } from '../interfaces/Token';

const checkAuth = (context: { req: { headers: { authorization: string } } }) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];
    if (token) {
      try {
        const user = jwt.verify(token, process.env.SECRET as string);
        return user as IToken;
      } catch {
        throw new AuthenticationError('Token inválida/expirada');
      }
    }
    throw new Error("Autenticação precisa ser 'Bearer [token]");
  }
  throw new Error('Autenticação precisa ser de um header');
};

export default checkAuth;
