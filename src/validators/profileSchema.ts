import Joi from 'joi';

const isValidText = Joi.string().alphanum();

const profileValidationSchema = Joi.object({
  name: isValidText.min(6).max(24).required().messages({
    'string.base': 'Nome deve ser um texto',
    'string.alphanum': 'Nome precisa ser alfanumérico',
    'string.min': 'Nome deve contér mais de seis caractéres',
    'string.required': 'Nome é obrigátório',
  }),
  bio: isValidText.max(255).optional().messages({
    'string.max': 'Limite de 255 caracteres para bio',
  }),
});

export default profileValidationSchema;
