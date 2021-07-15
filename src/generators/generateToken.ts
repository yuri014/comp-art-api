import jwt from 'jsonwebtoken';
import { LeanDocument } from 'mongoose';

import { IUser } from '../interfaces/User';

const generateToken = (user: IUser | LeanDocument<IUser>, expiresIn: string) =>
  jwt.sign(
    { id: user._id, username: user.username, isArtist: user.isArtist },
    process.env.SECRET as string,
    {
      expiresIn,
    },
  );

export default generateToken;
