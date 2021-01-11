import * as queries from '../db/queries';
import {DbProduct} from "../models/product";

export const getProducts = async (ctx, next) => {
    ctx.ok(queries.find());
    await next();
};

export const getProductById = async (ctx, next) => {
    const product: DbProduct = queries.findById(ctx.params.id);
    ctx.ok(product);
    await next();
};

export const addProduct = async (ctx, next) => {
    const product: DbProduct = queries.add(ctx.request.body);
    ctx.ok(product);
    await next();
};


export const deleteProduct = async (ctx, next) => {
    const product: DbProduct = queries.delete(ctx.params.id);
    ctx.ok(product);
    await next();
};

export const updateProduct = async (ctx, next) => {
    const product: DbProduct = queries.update(
        ctx.params.id,
        ctx.request.body
    );
    ctx.ok(product);
    await next();
};


