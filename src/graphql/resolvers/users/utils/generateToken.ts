import jwt from 'jsonwebtoken';

import { IUser } from '../../../../interfaces/User';

const generateToken = (result: IUser) =>
  jwt.sign(
    { id: result.id, email: result.email, username: result.username },
    process.env.SECRET as string,
    {
      expiresIn: '1d',
    },
  );

export default generateToken;
