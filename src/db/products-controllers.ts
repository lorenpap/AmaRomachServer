import {Product} from './products';

export const getProducts = async (ctx, next) => {
    ctx.ok(await Product.find());
    await next();
};

export const getProductById = async (ctx, next) => {
    const product = await Product.findById(ctx.params.id);
    if (!product) {
        ctx.throw(400, 'product not found ', ctx.params.id);
    }
    ctx.ok(product);
    await next();
};

export const addProduct = async (ctx, next) => {
    const product = await new Product(ctx.request.body).save();
    if (!product) {
        ctx.throw(400, 'product not found ', ctx.params.id);
    }
    ctx.ok(product);
    await next();
};


export const deleteProduct = async (ctx, next) => {
    const product = await Product.findByIdAndRemove(ctx.params.id);
    if (!product) {
        ctx.throw(400, 'product not found ', ctx.params.id);
    }
    ctx.ok(product);
    await next();
};

export const updateProduct = async (ctx, next) => {
    const product = await Product.findByIdAndUpdate(
        ctx.params.id,
        ctx.request.body, {new: true}
    );
    if (!product) {
        ctx.throw(400, 'product not found ', ctx.params.id);
    }
    ctx.ok(product);
    await next();
};


