import {productModel} from './products';
import {BaseProduct, Product} from "../models/product";
import * as mongoose from "mongoose";
import {Document, DocumentQuery} from "mongoose";
import {ProductSelectedAmount} from "../models/productAmount";

export const findProductsQuery = () => productModel.find();


export const findProductByIdQuery: (id: string) => DocumentQuery<Product, Product> = (id) => productModel.findById(id);


export const addProductQuery: (product: BaseProduct) => Promise<Document<Product>> = (product) =>
    new productModel(product).save();

export const deleteProductQuery: (id: string) =>
    DocumentQuery<Product, null> = (id) => productModel.findByIdAndRemove(id);

export const updateProductQuery: (id: string, body: BaseProduct) =>
    DocumentQuery<Product, null> = (id, body) => productModel.findByIdAndUpdate(
    id,
    body, {new: true}
);

export const checkoutProductQuery = async (product: ProductSelectedAmount, ctx) => {
    const session = await mongoose.startSession();
    try {
        const originalProduct: Product = await findProductByIdQuery(product.productId);
        const newProductAmount = originalProduct.amount - product.selectedAmount;
        const updatedProduct: Product = await updateProductQuery(
            product.productId,
            {amount: newProductAmount}
        ) as Product;
        ctx.ok(updatedProduct);
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw(ctx.throw(500, err.message));
    }
};
