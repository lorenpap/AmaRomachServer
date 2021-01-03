import Product from './products';

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
                ctx.throw(400);
            }
            ctx.throw(500);
        }
    }
}


export default ProductsControllers;
