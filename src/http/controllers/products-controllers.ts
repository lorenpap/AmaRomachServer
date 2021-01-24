import {Product} from "../../models/product";
import * as queries from "../../db/db-queries";
import {usersProducts} from "../../socket/cache";

export const getProducts = async (ctx, next) => {
    ctx.ok(await queries.findProductsQuery());
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
    for (const product of usersProducts[userId]) {
        const originalProduct: Product = await queries.findProductByIdQuery(product.productId);
        const newProductAmount = originalProduct.amount - product.selectedAmount;
        const updatedProduct: Product = await queries.updateProductQuery(
            product.productId,
            {amount: newProductAmount}
        ) as Product;
        delete usersProducts[userId];
        ctx.ok(updatedProduct);
    }
    await next();
};
