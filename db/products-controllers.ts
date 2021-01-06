import Product from './products';
import * as productValidation from '../validation/products-validation';
import {logger} from '../middlewares/logger';
import {errorHandler} from "../middlewares/error-handler";

class ProductsControllers {
    async getProducts(ctx) {
        ctx.ok(await Product.find());
    }

    async getProductById(ctx, next) {
        const product = await Product.findById(ctx.params.id);
        if (!product) {
            await errorHandler(ctx, next);
            return;
        }
        ctx.ok(product);
    }

    async addProduct(ctx, next) {
        const product = await new Product(ctx.request.body).save();
        const validationError = productValidation.productSchema.validate(ctx.request.body);
        if (validationError.error || !product) {
            await errorHandler(ctx, next);
            return;
        }
        ctx.ok(product);
        logger.log('info', 'add new product' + await new Product(ctx.request.body).save());
    }


    async deleteProduct(ctx, next) {
        const product = await Product.findByIdAndRemove(ctx.params.id);
        if (!product) {
            await errorHandler(ctx, next);
            return;
        }
        ctx.ok(product);
        logger.log('info', 'delete product ' + product);
    }

    async updateProduct(ctx, next) {
        const product = await Product.findByIdAndUpdate(
            ctx.params.id,
            ctx.request.body, {new: true}
        );
        const validationError = productValidation.productSchema.validate(ctx.request.body);
        if (!product || validationError.error) {
            await errorHandler(ctx, next);
            return;
        }
        ctx.ok(product);
        logger.log('info', 'update product' + product);
    }

}


export default ProductsControllers;
