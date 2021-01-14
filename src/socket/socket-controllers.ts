import {ProductSelectedAmount} from "../models/productAmount";
import {BaseProduct} from "../models/product";
import {findProductByIdQuery} from "../db/db-queries";
import {productsAmount, usersProducts} from "./cache";

export const updateProductAmount = async (socketId: string, productAmount: ProductSelectedAmount) => {
    const product: BaseProduct = await findProductByIdQuery(productAmount.productId);
    const userProduct: BaseProduct = {
        _id: productAmount.productId,
        amount: productAmount.selectedAmount
    };
    updateProductsAmountCache(product.amount, productAmount);
    updateUsersProductsCache(userProduct, socketId);
};

const updateProductsAmountCache = (initialAmount: number, productAmount: ProductSelectedAmount) => {
    const productIndex: number = productsAmount
        .findIndex(currentProduct => currentProduct._id === productAmount.productId);
    const updatedProduct: BaseProduct = {
        _id: productAmount.productId,
        amount: (productIndex === -1) ? initialAmount - productAmount.selectedAmount :
            productsAmount[productIndex].amount - productAmount.selectedAmount
    };
    productIndex === -1 ? productsAmount.push(updatedProduct) : productsAmount[productIndex] = {
        _id: updatedProduct._id,
        amount: updatedProduct.amount
    };
};

const updateUsersProductsCache = (updatedProduct: BaseProduct, userId: string) => {
    const userProduct = {
        productId: updatedProduct._id,
        selectedAmount: updatedProduct.amount
    };
    if (!usersProducts[userId]) {
        usersProducts[userId] = [userProduct];
    } else {
        const productIndex: number = usersProducts[userId].findIndex
        (products => products.productId === updatedProduct._id);
        productIndex === -1 ? usersProducts[userId].push(userProduct) :
            usersProducts[userId][productIndex] = userProduct;
    }
};
