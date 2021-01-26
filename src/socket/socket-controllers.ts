import {ProductSelectedAmount} from "../models/productAmount";
import {BaseProduct} from "../models/product";
import {findProductByIdQuery, findProductsQuery} from "../db/db-queries";
import {productsAmount, usersProducts} from "./cache";
import {Socket} from "socket.io";

export const updateCart = async (socket: Socket, productAmount: ProductSelectedAmount) => {
    await updateProductAmount(socket.id, productAmount);
    const updatedProduct: BaseProduct = getUpdatedProductAmount(socket.id, productAmount.productId);
    socket.broadcast.emit('updatedProduct', updatedProduct);
};

export const getUpdatedProductAmount = (socketId: string, productId: string): BaseProduct => {
    return productsAmount.find(product => product._id.toString() === productId);
};
export const updateProductAmount = async (socketId: string, productAmount: ProductSelectedAmount) => {
    const product: BaseProduct = await findProductByIdQuery(productAmount.productId);
    const products: BaseProduct[] = await findProductsQuery();
    const userProduct: BaseProduct = {
        _id: productAmount.productId,
        amount: productAmount.selectedAmount
    };
    if (product) {
        updateUsersProductsCache(userProduct, socketId);
        updateProductsAmountCache(products);
    }
};

const updateProductsAmountCache = (products: BaseProduct[]) => {
    products.forEach(product => {
        const index = productsAmount.findIndex(productAmountItem => product._id.toString() === productAmountItem._id.toString());
        const updatedProduct = {_id: product._id, amount: product.amount};
        index === -1 ? productsAmount.push(updatedProduct) : productsAmount[index] = updatedProduct;
    });
    Object.keys(usersProducts).forEach(key => usersProducts[key].forEach(productAmount => {
            const index = productsAmount.findIndex(product => product._id.toString() === productAmount.productId);
            return productsAmount[index].amount -= productAmount.selectedAmount;
        })
    );
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
