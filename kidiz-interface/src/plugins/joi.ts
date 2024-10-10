import Joi from 'joi';

export const loginSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().messages({
        'string.base': 'Username must be a string',
        'string.empty': 'Username cannot be empty',
        'string.min': 'Username must be at least 3 characters long',
        'string.max': 'Username cannot be longer than 30 characters',
    })
});

export const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
});

export const childSchema = Joi.object({
    lastname: Joi.string().required(),
    firstname: Joi.string().required(),
    childCareId: Joi.number().optional(),
});