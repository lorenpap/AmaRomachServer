import Product from './products';
import * as productValidation from '../config/products-validation';
import {logger} from '../config/logger';

class ProductsControllers {
    async getProducts(ctx) {
        ctx.ok(await Product.find().select('-__v'));
    }

    async getProductById(ctx) {
        try {
            const product = await Product.findById(ctx.params.id).select('-__v');
            if (!product) {
                ctx.badRequest();
                logger.log('error', 'bad request');
                return;
            }
            ctx.ok(product);
        } catch (err) {
            if (err.name === 'CastError' || err.name === 'NotFoundError') {
                ctx.badRequest();
                logger.log('error', err.message);
                return;
            }
            ctx.internalServerError();
            logger.log('error', err.message);
        }
    }

    async addProduct(ctx) {
        try {
            const validationError = productValidation.addProductSchema.validate(ctx.request.body);
            if (validationError.error) {
                ctx.badRequest();
                logger.log('error', validationError.error.message);
                return;
            }
            ctx.ok(await new Product(ctx.request.body).save());
            logger.log('info', 'add new product' + await new Product(ctx.request.body).save());
        } catch (err) {
            ctx.badRequest();
            logger.log('error', err.message);
        }
    }

    async deleteProduct(ctx) {
        try {
            const product = await Product.findByIdAndRemove(ctx.params.id).select('-__v');
            if (!product) {
                ctx.badRequest();
                logger.log('error', 'bad request');
                return;
            }
            ctx.ok(product);
            logger.log('info', 'delete product' + product);
        } catch (err) {
            if (err.name === 'CastError' || err.name === 'NotFoundError') {
                ctx.badRequest();
                logger.log('error', err);
                return;
            }
            ctx.internalServerError();
            logger.log('error', err);
        }
    }

    async updateProduct(ctx) {
        try {
            const product = await Product.findByIdAndUpdate(
                ctx.params.id,
                ctx.request.body, {new: true}
            ).select('-__v');
            const validationError = productValidation.updateProductSchema.validate(ctx.request.body);
            if (!product || validationError.error) {
                ctx.badRequest();
                logger.log('error', 'bad request');
                return;
            }
            ctx.ok(product);
            logger.log('info', 'update product' + product);
        } catch (err) {
            if (err.name === 'CastError' || err.name === 'NotFoundError') {
                ctx.badRequest();
                logger.log('error', err);
                return;
            }
            ctx.internalServerError();
            logger.log('error', err);
        }
    }
}


export default ProductsControllers;
