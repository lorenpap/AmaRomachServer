import * as Joi from "joi";

export const addProductSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    amount: Joi.number().required(),
    description: Joi.string().required()
});

export const updateProductSchema = Joi.object({
    name: Joi.string(),
    price: Joi.number(),
    amount: Joi.number(),
    description: Joi.string()
});
