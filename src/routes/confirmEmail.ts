import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import User from '../entities/User';

const confirmEmail = async (req: Request, res: Response) => {
  try {
    const user: any = jwt.verify(req.params.token, process.env.SECRET as string);
    const userId = await User.findById(user.id);
    if (userId) {
      await User.updateOne({ confirmed: true });
      res.send('ok');
    } else {
      res.send('invalid');
    }
  } catch (error) {
    res.send('invalid');
  }
};

export default confirmEmail;
