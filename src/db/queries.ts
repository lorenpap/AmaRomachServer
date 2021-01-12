import {Product} from '../db/products';

export const findProductsQuery = async() => await Product.find();

export const findProductByIdQuery = async(id) => await Product.findById(id);

export const addProductQuery = async(product) => await new Product(product).save();

export const deleteProductQuery = async(id) => await Product.findByIdAndRemove(id);

export const updateProductQuery  = async(id, body) => await Product.findByIdAndUpdate(
    id,
    body, {new: true}
);
