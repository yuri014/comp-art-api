import Joi from 'joi';

const isValidText = Joi.string();

const commentValidationSchema = Joi.object({
  body: isValidText.allow('').max(255).messages({
    'string.base': 'Descrição deve ser um texto',
    'string.min': 'Descrição limite de 255 caracteres',
  }),
  author: isValidText.allow(''),
});

export default commentValidationSchema;
