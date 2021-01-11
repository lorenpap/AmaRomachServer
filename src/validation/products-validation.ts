import * as Joi from "joi";

export const productSchema = Joi.object({
    name: Joi.string(),
    price: Joi.number().positive(),
    amount: Joi.number().positive(),
    description: Joi.string()
});
