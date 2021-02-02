import {Product} from "../../models/product";
import * as queries from "../../db/db-queries";
import * as UserCart from '../../socket/cart';
import {getUpdatedProductsAmount} from '../../socket/cart';
import {isError} from "tslint/lib/error";

export const getProducts = async (ctx, next) => {
    ctx.products = await queries.findProductsQuery();
    await next();
};

export const updateProductsAmount = async (ctx, next) => {
    ctx.ok(getUpdatedProductsAmount(ctx.products));
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
    const checkoutResponse = await queries.checkoutProductQuery(usersProducts[userId]);
    UserCart.deleteUserCart(userId);
    if (isError(checkoutResponse)) {
        throw (ctx.throw(500, 'checkout error'));
    }
    ctx.ok(checkoutResponse);
    await next();
};
