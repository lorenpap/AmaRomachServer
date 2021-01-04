import Product from './products';
import * as productValidation from './products-validation';

class ProductsControllers {
    async getProducts(ctx) {
        ctx.body = await Product.find();
    }

    async getProductById(ctx) {
        try {
            const product = await Product.findById(ctx.params.id);
            if (!product) {
                ctx.throw(400);
            }
            ctx.body = product;
        } catch (err) {
            if (err.name === 'CastError' || err.name === 'NotFoundError') {
                ctx.throw(400);
            }
            ctx.throw(500);
        }
    }

    async addProduct(ctx) {
        try {
            const validationError = productValidation.joiSchema.validate(ctx.request.body);
            if (validationError.error) {
                console.log(validationError);
                ctx.throw(400);
            }
            ctx.body = await new Product(ctx.request.body).save();
        } catch (err) {
            ctx.throw(400);
        }
    }

    async deleteProduct(ctx) {
        try {
            const product = await Product.findByIdAndRemove(ctx.params.id);
            if (!product) {
                ctx.throw(400);
            }
            ctx.body = product;
        } catch (err) {
            if (err.name === 'CastError' || err.name === 'NotFoundError') {
                ctx.throw(400);
            }
            ctx.throw(500);
        }
    }

    async updateProduct(ctx) {
        try {
            const validationError = productValidation.joiSchema.validate(ctx.request.body);
            if (validationError.error) {
                console.log(validationError);
                ctx.throw(400);
            }
            const product = await Product.findByIdAndUpdate(
                ctx.params.id,
                ctx.request.body
            );
            if (!product) {
                ctx.throw(400);
            }
            ctx.body = product;
        } catch (err) {
            if (err.name === 'CastError' || err.name === 'NotFoundError') {
                ctx.throw(404);
            }
            ctx.throw(500);
        }
    }
}


export default ProductsControllers;
