import {UsersProducts} from "../models/usersProducts";
import {Product} from "../models/product";
import {findProductByIdQuery} from "../db/db-queries";

const usersProducts: UsersProducts = {};

export const createUserCart = (userId: string) => {
    usersProducts[userId] = {};
};

export const deleteUserCart = (userId: string) => {
    usersProducts[userId] = {};
};

export const getUpdatedUserCart = async (socketId: string, productId: string): Promise<Partial<Product>> => {
    const product: Product = await findProductByIdQuery(productId);
    let updatedProductAmount: number = product.amount;
    Object.keys(usersProducts).filter(userId => usersProducts[userId][productId])
        .forEach(userId => updatedProductAmount -= usersProducts[userId][productId]);
    return {_id: productId, amount: updatedProductAmount};
};

export const updateUsersProductsCache = (updatedProduct: Partial<Product>, userId: string) => {
    usersProducts[userId][updatedProduct._id] = updatedProduct.amount;
};

export const getUsersProducts = () => usersProducts;

export const getUpdatedProductsAmount = (products: Partial<Product>[]) => {
    products = products.filter(dbProduct => dbProduct.amount).map(dbProduct => {
        let productAmount: number = 0;
        Object.keys(usersProducts).filter(userId => usersProducts[userId][dbProduct._id]).forEach(userId =>
            productAmount += usersProducts[userId][dbProduct._id]);
        return productAmount ? {...dbProduct.toObject(), amount: dbProduct.amount - productAmount} : dbProduct;
    });
    return products;
};
