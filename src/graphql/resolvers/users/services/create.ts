import bcrypt from 'bcryptjs';
import { UserInputError } from 'apollo-server-express';

import { IRegisterFields } from '../../../../interfaces/User';
import { validateRegisterInput } from '../../../../utils/validateRegisterInput';
import User from '../../../../entities/User';
import handleSendConfirmationEmail from '../../../../utils/handleSendConfirmationEmail';

const createUser = async (input: IRegisterFields) => {
  const user = {
    username: input.username.trim(),
    email: input.email.trim(),
    password: input.password.trim(),
    confirmPassword: input.confirmPassword.trim(),
  };

  const errors = await validateRegisterInput(user as IRegisterFields);

  if (errors.error) {
    throw new UserInputError('Erros', {
      errors: errors.error.message,
    });
  }

  const usernameExists = await User.findOne({ username: user.username });
  const emailExists = await User.findOne({ email: user.email });

  if (usernameExists || emailExists) {
    throw new UserInputError('Username ou email já existe', {
      errors: {
        duplicate: usernameExists ? 'Username já existe' : 'Email já existe',
      },
    });
  }

  const encryptedPassword = await bcrypt.hash(user.password, 12);

  const newUser = new User({
    username: user.username,
    email: user.email,
    password: encryptedPassword,
    isArtist: input.isArtist,
    createdAt: new Date().toISOString(),
  });

  const result = await newUser.save();

  await handleSendConfirmationEmail(result);

  return true;
};

export default createUser;
