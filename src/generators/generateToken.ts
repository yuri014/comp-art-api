import jwt from 'jsonwebtoken';

import { IUser } from '@interfaces/User';

const generateToken = (user: IUser, expiresIn: string) =>
  jwt.sign(
    { id: user.id, username: user.username, isArtist: user.isArtist },
    process.env.SECRET as string,
    {
      expiresIn,
    },
  );

export default generateToken;
