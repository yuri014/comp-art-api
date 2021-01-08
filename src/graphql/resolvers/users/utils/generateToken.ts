import jwt from 'jsonwebtoken';

import { IUser } from '../../../../interfaces/User';

const generateToken = (user: IUser, expiresIn: string) =>
  jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    process.env.SECRET as string,
    {
      expiresIn,
    },
  );

export default generateToken;
