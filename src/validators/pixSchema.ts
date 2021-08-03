import Joi from 'joi';

const isValidText = Joi.string().allow('');

const pixValidationSchema = Joi.object({
  key: isValidText.max(72).messages({
    'string.base': 'Chave deve ser um texto',
    'string.min': 'Chave tem limite de 72 caracteres',
  }),
  city: isValidText.max(255).messages({
    'string.base': 'Cidade deve ser um texto',
    'string.max': 'Cidade deve contér menos de 255 caracteres',
  }),
  message: isValidText.max(255).messages({
    'string.base': 'Mensagem deve ser um texto',
    'string.max': 'Mensagem deve contér menos de vinte e quatro caracteres',
  }),
});

export default pixValidationSchema;
