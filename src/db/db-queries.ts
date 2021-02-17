import {productModel} from './products';
import {Product} from "../models/product";
import {DocumentQuery} from "mongoose";

export const findProductsQuery = () => productModel.find();


export const findProductByIdQuery: (id: string) => DocumentQuery<Product, Product> = (id) => productModel.findById(id);


export const addProductQuery: (product: Product) => Promise<Product> = (product) =>
    new productModel(product).save();

export const deleteProductQuery: (id: string) =>
    DocumentQuery<Product, null> = (id) => productModel.findByIdAndRemove(id);

export const updateProductQuery: (id: string, body: Partial<Product>) =>
    DocumentQuery<Product, null> = (id, body) => productModel.findByIdAndUpdate(
    id,
    body, {new: true}
);

export const checkoutProductQuery = async (userProducts: Record<string, number>): Promise<Product[] | Error> => {
    const session = await productModel.startSession();
    session.startTransaction();
    try {
        await Promise.all(
            Object.keys(userProducts).map(async productId => {
                    const originalProduct: Product = await findProductByIdQuery(productId);
                    const newProductAmount = originalProduct.amount - userProducts[productId];
                    return await updateProductQuery(
                        productId,
                        {amount: newProductAmount}) as Product;
                }
            ));
        await session.commitTransaction();
        session.endSession();
        return await findProductsQuery();
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        return err;
    }
};
