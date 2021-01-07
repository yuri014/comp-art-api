import Joi from 'joi';

const userValidateSchema = Joi.object({
  // eslint-disable-next-line newline-per-chained-call
  username: Joi.string().alphanum().min(6).max(24).required().messages({
    'string.base': 'Username deve ser um texto',
    'string.alphanum': 'Username apenas pode ser alfanumérico',
    'string.min': 'Username deve contér mais de seis caractéres',
    'string.required': 'Username é obrigátório',
  }),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required()
    .messages({
      'string.email': 'Email deve ser um campo válido',
    }),

  password: Joi.string()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$'))
    .required()
    .messages({
      'string.base': 'Senha deve ser um texto',
      'string.pattern.base':
        'Senha deve conter uma letra maiuscúla, uma letra minúscula, um número,e um caracter especial e mínimo de 8 caracteres',
      'string.required': 'Senha é obrigátório',
    }),

  confirmPassword: Joi.any()
    .equal(Joi.ref('password'))
    .messages({ 'any.only': 'Senha não confere' }),
}).with('password', 'confirmPassword');

export default userValidateSchema;
