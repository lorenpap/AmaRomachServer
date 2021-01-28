import {productModel} from './products';
import {Product} from "../models/product";
import * as mongoose from "mongoose";
import {Document, DocumentQuery} from "mongoose";

export const findProductsQuery = () => productModel.find();


export const findProductByIdQuery: (id: string) => DocumentQuery<Product, Product> = (id) => productModel.findById(id);


export const addProductQuery: (product: Product) => Promise<Document<Product>> = (product) =>
    new productModel(product).save();

export const deleteProductQuery: (id: string) =>
    DocumentQuery<Product, null> = (id) => productModel.findByIdAndRemove(id);

export const updateProductQuery: (id: string, body: Partial<Product>) =>
    DocumentQuery<Product, null> = (id, body) => productModel.findByIdAndUpdate(
    id,
    body, {new: true}
);

export const checkoutProductQuery = async (productId: string, productAmount: number, ctx) => {
    const session = await mongoose.startSession();
    try {
        const originalProduct: Product = await findProductByIdQuery(productId);
        const newProductAmount = originalProduct.amount - productAmount;
        const updatedProduct: Product = await updateProductQuery(
            productId,
            {amount: newProductAmount}
        ) as Product;
        ctx.ok(updatedProduct);
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw(ctx.throw(500, err.message));
    }
};
