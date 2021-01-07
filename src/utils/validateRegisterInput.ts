import { IRegisterFields } from '../interfaces/User';

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

export const validateRegisterInput = (user: IRegisterFields) => {
  const errors: { [key: string]: string } = {};

  if (isNotEmpty(user.email)) {
    errors.email = 'Email não pode ser vazio';
  } else if (!user.email.match(/^\S+@\S+$/)) {
    errors.email = 'Email inválido';
  }

  if (isNotEmpty(user.password)) {
    errors.password = 'Senha não pode ser vazia';
  } else if (user.password.trim() !== user.confirmPassword.trim()) {
    errors.password = 'Senhas não conferem';
  }

  if (isNotEmpty(user.username)) {
    errors.username = 'Nome de usuário não pode ser vazio';
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0,
  };
};
