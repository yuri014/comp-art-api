import Joi from 'joi';

const isValidText = Joi.string();

const postValidationSchema = Joi.object({
  description: isValidText.allow('').max(255).messages({
    'string.base': 'Descrição deve ser um texto',
    'string.min': 'Descrição limite de 255 caracteres',
  }),
  name: isValidText.required().min(4).max(24).messages({
    'string.base': 'Nome deve ser um texto',
    'string.min': 'Nome deve contér mais de quatro caractéres',
    'string.max': 'Nome deve contér menos de vinte e quatro caractéres',
    'string.required': 'Nome é obrigatório',
  }),
  artist: isValidText.required().messages({
    'string.base': 'Artista deve ser um texto',
    'string.required': 'Artista é obrigatório',
  }),
  value: Joi.number().required().messages({
    'number.base': 'Valor deve ser um número',
    'number.required': 'Valor é obrigatório',
  }),
  category: isValidText.required().min(4).max(32).messages({
    'string.base': 'Categoria deve ser um texto',
    'string.min': 'Categoria deve contér mais de quatro caractéres',
    'string.max': 'Categoria deve contér menos de trinta e dois caractéres',
    'string.required': 'Categoria é obrigatório',
  }),
  phone: isValidText.required().min(4).max(12).messages({
    'string.base': 'Telefone deve ser um texto',
    'string.min': 'Telefone deve contér mais de quatro caractéres',
    'string.max': 'Telefone deve contér menos de doze caractéres',
    'string.required': 'Telefone é obrigatório',
  }),
});

export default postValidationSchema;
