import { IRegisterFields } from '../../interfaces/User';
import userValidateSchema from '../userSchema';

const isNotEmpty = (field: string) => field.trim() === '';

export const validateLoginInput = (email: string, password: string) => {
  if (isNotEmpty(email)) {
    const error = 'Email não pode ser vazio';

    return {
      error,
      valid: false,
    };
  }

  if (isNotEmpty(password)) {
    const error = 'Senha não pode ser vazia';

    return {
      error,
      valid: false,
    };
  }

  return {
    error: 'teste',
    valid: true,
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
