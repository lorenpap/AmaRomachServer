import {Product} from "../../models/product";
import * as queries from "../../db/db-queries";
import * as UserCart from '../../socket/cache';

export const getProducts = async (ctx, next) => {
    ctx.products = await queries.findProductsQuery();
    await next();
};

export const getUpdatedProducts = async (ctx, next) => {
    let products = ctx.products;
    const usersProducts = UserCart.getUsersProducts();
    products = products.map(dbProduct => {
        let productAmount: number = 0;
        Object.keys(usersProducts).filter(userId => usersProducts[userId][dbProduct._id.toString()]).forEach(userId =>
            productAmount += usersProducts[userId][dbProduct._id.toString()]);
        return productAmount ? {...dbProduct.toObject(), amount: dbProduct.amount - productAmount} : dbProduct;
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
    const usersProducts = UserCart.getUsersProducts();
    const userId = ctx.request.body.id;
    await Promise.all(
        Object.keys(usersProducts[userId]).map(async productId => {
                await queries.checkoutProductQuery(productId, usersProducts[userId][productId], ctx);
                UserCart.deleteUserCart(userId);
            }
        ));
    await next();
};
