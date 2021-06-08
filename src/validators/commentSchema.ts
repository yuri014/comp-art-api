import Joi from 'joi';

const isValidText = Joi.string();

const commentValidationSchema = Joi.object({
  // eslint-disable-next-line newline-per-chained-call
  comment: isValidText.required().min(1).max(255).messages({
    'string.base': 'Comentário deve ser um texto',
    'string.min': 'Comentário precisa de pelo menos um caracter',
    'string.max': 'Comentário limite de 255 caracteres',
  }),
});

export default commentValidationSchema;
