import {Product} from '../db/products';
import {Product} from "../models/product";

export const findProductsQuery: Product[] = async() => await Product.find();

export const findProductByIdQuery: Product = async(id) => await Product.findById(id);

export const addProductQuery: Product = async(product) => await new Product(product).save();

export const deleteProductQuery: Product = async(id) => await Product.findByIdAndRemove(id);

export const updateProductQuery: Product  = async(id, body) => await Product.findByIdAndUpdate(
    id,
    body, {new: true}
);
