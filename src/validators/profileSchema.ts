import Joi from 'joi';

const isValidText = Joi.string();

const profileValidationSchema = Joi.object({
  name: isValidText.min(4).max(24).required().messages({
    'string.base': 'Nome deve ser um texto',
    'string.min': 'Nome deve contér mais de seis caractéres',
    'string.required': 'Nome é obrigátório',
  }),
  bio: isValidText.allow('').max(255).messages({
    'string.max': 'Limite de 255 caracteres para bio',
  }),
});

export default profileValidationSchema;
