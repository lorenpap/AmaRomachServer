import * as Joi from "joi";

export const productSchema = Joi.object({
    name: Joi.string(),
    price: Joi.number(),
    amount: Joi.number(),
    description: Joi.string()
});
