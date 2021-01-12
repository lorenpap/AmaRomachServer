import * as productValidation from "../../validation/products-validation";
import {ObjectSchema} from "joi";

const checkValidation = async (schema: ObjectSchema, ctx, next) => {
    const validationObject = schema.validate(ctx.request.body);
    if (validationObject.error) {
        throw(ctx.throw(400, 'product validation error' + validationObject.error.message));
    }
    await next();
};
export const addProductValidation = async (ctx, next) => {
    await checkValidation(productValidation.productSchema.options({presence: "required"}), ctx, next);
};

export const updateProductValidation = async (ctx, next) => {
    await checkValidation(productValidation.productSchema, ctx, next);
};
