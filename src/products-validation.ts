import * as Joi from "joi";

export const joiSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    amount: Joi.number().required(),
    description: Joi.string().required()
});
