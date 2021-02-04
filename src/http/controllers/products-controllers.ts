import {Product} from "../../models/product";
import * as queries from "../../db/db-queries";
import * as UserCart from '../../socket/cart';
import {getUpdatedProductsAmount} from '../../socket/cart';
import * as jwt from "jsonwebtoken";

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
    const product: Product = await queries.addProductQuery(ctx.request.body);
    ctx.ok(product);
    await next();
};


export const deleteProduct = async (ctx, next) => {
    const product: Product = await queries.deleteProductQuery(ctx.params.id);
    ctx.ok(product);
    await next();
};

export const updateProduct = async (ctx, next) => {
    const product: Product = await queries.updateProductQuery(
        ctx.params.id,
        ctx.request.body
    );
    ctx.ok(product);
    await next();
};

export const checkout = async (ctx, next) => {
    const usersProducts = UserCart.getUsersProducts();
    const checkoutResponse = await queries.checkoutProductQuery(usersProducts[ctx.token]);
    UserCart.deleteUserCart(ctx.token);
    if (checkoutResponse instanceof Error) {
        throw (ctx.throw(500, 'checkout error'));
    }
    ctx.ok(checkoutResponse);
    await next();
};

export const login = async (ctx, next) => {
    const token = jwt.sign({username: "ado"}, 'supersecret', {expiresIn: 120});
    ctx.cookies.set('token', token, {httpOnly: false});
    ctx.ok(true);
    await next();
};
