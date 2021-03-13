import Joi from 'joi';

const isValidText = Joi.string();

const profileValidationSchema = Joi.object({
  name: isValidText.min(4).max(24).required().messages({
    'string.base': 'Nome deve ser um texto',
    'string.min': 'Nome deve contér mais de quatro caractéres',
    'string.max': 'Nome tem um limite de 24 caractéres',
    'string.required': 'Nome é obrigatório',
  }),
  bio: isValidText.allow('').max(255).messages({
    'string.max': 'Limite de 255 caracteres para bio',
  }),
});

export default profileValidationSchema;
