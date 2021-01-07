import {Product} from './products';
import * as productValidation from '../validation/products-validation';
import {logger} from '../logger/logger';

export const getProducts = async (ctx) => {
    ctx.ok(await Product.find());
};

export const getProductById = async (ctx) => {
    const product = await Product.findById(ctx.params.id);
    if (!product) {
        ctx.throw(400, 'product not found ', ctx.params.id);
    }
    ctx.ok(product);
};

export const addProduct = async (ctx) => {
    const product = await new Product(ctx.request.body).save();
    const validationError = productValidation.productSchema.validate(ctx.request.body);
    if (validationError.error || !product) {
        ctx.throw(400, 'product validation error' + validationError.error.message);
    }
    if (!product) {
        ctx.throw(400, 'product not found ', ctx.params.id);
    }
    ctx.ok(product);
    logger.log('info', 'add new product' + await new Product(ctx.request.body).save());
};


export const deleteProduct = async (ctx) => {
    const product = await Product.findByIdAndRemove(ctx.params.id);
    if (!product) {
        ctx.throw(400, 'product not found ', ctx.params.id);
    }
    ctx.ok(product);
    logger.log('info', 'delete product ' + product);
};

export const updateProduct = async (ctx) => {
    const product = await Product.findByIdAndUpdate(
        ctx.params.id,
        ctx.request.body, {new: true}
    );
    const validationError = productValidation.productSchema.validate(ctx.request.body);
    if (validationError.error) {
        ctx.throw(400, 'product validation error' + validationError.error.message);
    }
    if (!product) {
        ctx.throw(400, 'product not found ', ctx.params.id);
    }
    ctx.ok(product);
    logger.log('info', 'update product' + product);
};


