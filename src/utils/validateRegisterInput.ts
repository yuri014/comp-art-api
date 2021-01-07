import { IRegisterFields } from '../interfaces/User';
import userValidateSchema from '../validators/userSchema';

const isNotEmpty = (field: string) => field.trim() === '';

export const validateLoginInput = (username: string, password: string) => {
  const errors: { [key: string]: string } = {};

  if (isNotEmpty(username)) {
    errors.email = 'Email não pode ser vazio';
  }

  if (isNotEmpty(password)) {
    errors.password = 'Senha não pode ser vazia';
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};

export const validateRegisterInput = async (user: IRegisterFields) => {
  const errors = userValidateSchema.validate({
    username: user.username,
    email: user.email,
    password: user.password,
    confirmPassword: user.confirmPassword,
  });

  return errors;
};
