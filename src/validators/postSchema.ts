import Joi from 'joi';

const isValidText = Joi.string();

const postValidationSchema = Joi.object({
  description: isValidText.allow('').max(255).messages({
    'string.base': 'Descrição deve ser um texto',
    'string.min': 'Descrição tem limite de 255 caracteres',
  }),
  alt: isValidText.allow('').max(60).messages({
    'string.base': 'Texto alternativo deve ser um texto',
    'string.min': 'Texto alternativo tem limite de 60 caracteres',
  }),
});

export default postValidationSchema;
