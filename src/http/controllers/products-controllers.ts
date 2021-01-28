import {Product} from "../../models/product";
import * as queries from "../../db/db-queries";
import {productsAmount, usersProducts} from "../../socket/cache";

export const getProducts = async (ctx, next) => {
    ctx.products = await queries.findProductsQuery();
    await next();
};

export const getUpdatedProducts = async (ctx, next) => {
    let products = ctx.products;
    products = products.map(dbProduct => {
        const updatedProduct = productsAmount.find(product =>
            product._id.toString() === dbProduct._id.toString());
        return updatedProduct ? {...dbProduct, amount: updatedProduct.amount} : dbProduct;
    });
    ctx.ok(products);
    await next();
};
export const getProductById = async (ctx, next) => {
    const product: Product = await queries.findProductByIdQuery(ctx.params.id);
    ctx.ok(product);
    await next();
};

export const addProduct = async (ctx, next) => {
    const product: Product = await queries.addProductQuery(ctx.request.body) as Product;
    ctx.ok(product);
    await next();
};


export const deleteProduct = async (ctx, next) => {
    const product: Product = await queries.deleteProductQuery(ctx.params.id) as Product;
    ctx.ok(product);
    await next();
};

export const updateProduct = async (ctx, next) => {
    const product: Product = await queries.updateProductQuery(
        ctx.params.id,
        ctx.request.body
    ) as Product;
    ctx.ok(product);
    await next();
};

export const checkout = async (ctx, next) => {
    const userId = ctx.request.body.id;
    await Promise.all(
        usersProducts[userId].map(async product => {
                await queries.checkoutProductQuery(product, ctx);
                delete usersProducts[userId];
            }
        ));
    await next();
};
