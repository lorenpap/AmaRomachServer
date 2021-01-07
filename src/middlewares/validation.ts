import * as productValidation from "../validation/products-validation";

export const validation = async (ctx, next) => {
    const validationObject = productValidation.productSchema.options({presence: "required"}).validate(ctx.request.body);
    if (validationObject.error) {
        throw(ctx.throw(400, 'product validation error' + validationObject.error.message));
    }
    await next();
};

export const partialValidation = async (ctx, next) => {
    const validationObject = productValidation.productSchema.validate(ctx.request.body);
    if (validationObject.error) {
        throw(ctx.throw(400, 'product validation error' + validationObject.error.message));
    }
    await next();
};
