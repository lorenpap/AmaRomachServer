import {UsersProducts} from "../models/usersProducts";
import {Product} from "../models/product";
import {findProductByIdQuery} from "../db/db-queries";

const usersProducts: UsersProducts = {};

export const createUserCart = (userId: string) => {
    usersProducts[userId] = {};
};

export const deleteUserCart = (userId: string) => {
    delete usersProducts[userId];
};

export const getUserProductAmount = async (socketId: string, productId: string): Promise<Partial<Product>> => {
    const product: Product = await findProductByIdQuery(productId);
    const updatedProductAmount = Object.keys(usersProducts).reduce((acc, curr) => {
        return acc - (usersProducts[curr][productId] || 0);
    }, product.amount);
    return {_id: productId, amount: updatedProductAmount};
};

export const updateUsersProductsCache = (updatedProduct: Partial<Product>, userId: string) => {
    usersProducts[userId][updatedProduct._id] = updatedProduct.amount;
};

export const getUsersProducts = () => usersProducts;

export const getUpdatedProductsAmount = (products: Partial<Product>[]) => {
    return products.filter(dbProduct => dbProduct.amount).map(dbProduct => {
        const productAmount = Object.keys(usersProducts).reduce((acc, curr) => {
            return acc + (usersProducts[curr][dbProduct._id] || 0);
        }, 0);
        return productAmount ? {...dbProduct.toObject(), amount: dbProduct.amount - productAmount} : dbProduct;
    });
};
