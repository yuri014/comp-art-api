import Joi from 'joi';

const isValidText = Joi.string();

const productValidationSchema = Joi.object({
  description: isValidText.allow('').max(255).messages({
    'string.base': 'Descrição deve ser um texto',
    'string.min': 'Descrição limite de 255 caracteres',
  }),
  name: isValidText.required().min(4).max(24).messages({
    'string.base': 'Nome deve ser um texto',
    'string.min': 'Nome deve contér mais de quatro caracteres',
    'string.max': 'Nome deve contér menos de vinte e quatro caracteres',
    'string.required': 'Nome é obrigatório',
  }),
  price: Joi.number().required().messages({
    'number.base': 'Preço deve ser um número',
    'number.required': 'Preço é obrigatório',
  }),
  category: isValidText.required().min(4).max(32).messages({
    'string.base': 'Categoria deve ser um texto',
    'string.min': 'Categoria deve contér mais de quatro caracteres',
    'string.max': 'Categoria deve contér menos de trinta e dois caracteres',
    'string.required': 'Categoria é obrigatório',
  }),
});

export default productValidationSchema;
