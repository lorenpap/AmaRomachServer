import * as Joi from "joi";

export const productSchema = Joi.when(Joi.ref('$method'), {
    "is": "post",
    "then": Joi.object().keys({
        name: Joi.string().required(),
        price: Joi.number().required(),
        amount: Joi.number().required(),
        description: Joi.string().required()
    }),
    "otherwise": Joi.object().keys({
        name: Joi.string(),
        price: Joi.number(),
        amount: Joi.number(),
        description: Joi.string()
    })
});
