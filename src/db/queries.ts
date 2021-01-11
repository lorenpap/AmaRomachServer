import {Product} from '../db/products';

export const find = async() => await Product.find());

export const findById = async(id) => await Product.findById(id);

export const add = async(product) => await new Product(product).save()

export const delete = async(id) => await Product.findByIdAndRemove(id);

export const update  = async(id, body) => await Product.findByIdAndUpdate(
                                          id,
                                          body, {new: true}
                                      );
