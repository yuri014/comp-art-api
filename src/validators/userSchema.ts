import Joi from 'joi';

const userValidation = {
  // eslint-disable-next-line newline-per-chained-call
  username: Joi.string().alphanum().min(6).max(24).required().messages({
    'string.base': 'Username deve ser um texto',
    'string.alphanum': 'Username apenas pode ser alfanumérico',
    'string.min': 'Username deve contér mais de seis caractéres',
    'string.required': 'Username é obrigatório',
  }),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required()
    .max(255)
    .messages({
      'string.max': 'Email deve ter no máximo 255 caracteres',
      'string.email': 'Email deve ser um campo válido',
    }),
};

export const userValidator = (otherValidations?: { [key: string]: Joi.StringSchema }) =>
  Joi.object({
    ...otherValidations,
    // eslint-disable-next-line newline-per-chained-call
    password: Joi.string().required().min(8).max(64).messages({
      'string.base': 'Senha deve ser um texto',
      'string.min': 'Senha deve ter no mínimo de 8 caracteres',
      'string.max': 'Senha deve ter no máximo de 64 caracteres',
      'string.required': 'Senha é obrigatório',
    }),

    confirmPassword: Joi.any()
      .equal(Joi.ref('password'))
      .messages({ 'any.only': 'Senhas não conferem' }),
  }).with('password', 'confirmPassword');

const userValidateSchema = userValidator(userValidation);

export default userValidateSchema;
