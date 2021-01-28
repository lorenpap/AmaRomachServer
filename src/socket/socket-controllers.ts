import {ProductSelectedAmount} from "../models/productAmount";
import {Product} from "../models/product";
import * as UserCart from "./cache";
import {Socket} from "socket.io";

export const createUserCart = (userId: string) => UserCart.createUserCart(userId);

export const deleteUserCart = (userId: string) => UserCart.deleteUserCart(userId);

export const updateCart = async (socket: Socket, productAmount: ProductSelectedAmount) => {
    const userProduct: Partial<Product> = {
        _id: productAmount.productId,
        amount: productAmount.selectedAmount
    };
    UserCart.updateUsersProductsCache(userProduct, socket.id);
    const updatedProduct: Partial<Product> = await getUpdatedProductAmount(socket.id, productAmount.productId);
    socket.broadcast.emit('updatedProduct', updatedProduct);
};
export const getUpdatedProductAmount = async (socketId: string, productId: string): Promise<Partial<Product>> =>
    UserCart.getUpdatedUserCart(socketId, productId);
