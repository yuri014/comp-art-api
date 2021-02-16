import Joi from 'joi';

const isValidText = Joi.string();

const commentValidationSchema = Joi.object({
  comment: isValidText.allow('').max(255).messages({
    'string.base': 'Descrição deve ser um texto',
    'string.min': 'Descrição limite de 255 caracteres',
  }),
});

export default commentValidationSchema;
