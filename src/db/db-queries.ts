import {productModel} from './products';
import {BaseProduct, Product} from "../models/product";
import {Document, DocumentQuery} from "mongoose";

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

