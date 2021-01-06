import Product from './products';
import * as productValidation from '../validation/products-validation';
import {logger} from '../middlewares/logger';

class ProductsControllers {
    async getProducts(ctx) {
        ctx.ok(await Product.find().select('-__v'));
    }

    async getProductById(ctx) {
        ctx.ok(await Product.findById(ctx.params.id).select('-__v'));
    }

    async addProduct(ctx) {
        const validationError = productValidation.addProductSchema.validate(ctx.request.body);
        if (validationError.error) {
            ctx.badRequest();
            logger.log('error', validationError.error.message);
            return;
        }
        ctx.ok(await new Product(ctx.request.body).save());
        logger.log('info', 'add new product' + await new Product(ctx.request.body).save());
    }

    async deleteProduct(ctx) {
        const product = await Product.findByIdAndRemove(ctx.params.id).select('-__v');
        if (!product) {
            ctx.badRequest();
            logger.log('error', 'bad request');
            return;
        }
        ctx.ok(product);
        logger.log('info', 'delete product ' + product);
    }

    async updateProduct(ctx) {
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
    }
}


export default ProductsControllers;
