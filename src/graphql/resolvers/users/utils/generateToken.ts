import jwt from 'jsonwebtoken';

import { IUser } from '../../../../interfaces/User';

export const generateRecoverPasswordToken = (email: string) =>
  jwt.sign({ email }, process.env.SECRET as string, { expiresIn: '10m' });

const generateToken = (result: IUser) =>
  jwt.sign(
    { id: result.id, email: result.email, username: result.username },
    process.env.SECRET as string,
    {
      expiresIn: '1d',
    },
  );

export default generateToken;
