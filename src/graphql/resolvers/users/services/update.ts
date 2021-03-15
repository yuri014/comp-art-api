import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import User from '../../../../entities/User';

export const confirmUser = async (token: string) => {
  try {
    const user = jwt.verify(token, process.env.SECRET as string) as { id: string };
    const userById = await User.findByIdAndUpdate(
      user.id,
      { confirmed: true },
      { useFindAndModify: false },
    );
    if (!userById) {
      throw new Error();
    }
    return userById;
  } catch (error) {
    throw new Error(error);
  }
};

export const updatePassword = async (token: string, newPassword: string) => {
  try {
    const { id } = jwt.verify(token, process.env.SECRET as string) as { id: string };
    const user = User.findById(id);
    const encryptedPassword = await bcrypt.hash(newPassword, 12);
    if (user) {
      await User.updateOne({ password: encryptedPassword });
    }
    return token;
  } catch (error) {
    throw new Error(error);
  }
};
