import * as productValidation from "../validation/products-validation";

export const validation = async (ctx, next) => {
    try {
        productValidation.productSchema.validate(ctx.request.body);
        next();
    } catch (e) {
        throw(ctx.throw(400, 'product validation error' + e.message));
    }
};
