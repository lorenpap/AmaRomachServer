import * as queries from "../db/db-queries";
import * as jwt from "jsonwebtoken";
import * as UserCart from '../socket/cart';
import {getUpdatedProductsAmount} from '../socket/cart';
import {getUpdatedProductAmount} from "../socket/socket-controllers";
import {Product} from "../models/product";
import {PubSub} from 'apollo-server-koa';

const pubsub = new PubSub();
const trigger = 'PRODUCT_UPDATED';

export const updateProduct = () => pubsub.asyncIterator([trigger]);
export const resolvers = {

    Query: {
        getProducts: async (_, args, context) => {
            if (context.token) {
                return getUpdatedProductsAmount(await queries.findProductsQuery());
            }
            return null;
        },
        getProduct: async (_, {_id}, context) => context.token ?
            await queries.findProductByIdQuery(_id) : null
    },
    Mutation: {
        addProduct: async (_, {product}, context) => {
            if (context.token) {
                const newProduct = await queries.addProductQuery(product);
                pubsub.publish(trigger, {productUpdated: newProduct.toObject()});
                return newProduct;
            }
            return null;
        },
        deleteProduct: async (_, {_id}, context) => {
            if (context.token) {
                const deletedProduct = await queries.deleteProductQuery(_id);
                pubsub.publish(trigger, {productUpdated: deletedProduct.toObject()});
                return deletedProduct;
            }
            return null;
        },
        login: () => {
            const token = jwt.sign({username: "ado"}, 'supersecret', {expiresIn: 1000});
            UserCart.createUserCart(token);
            return token;
        },
        updateProductAmount: (_, {productId, selectedAmount}, context) => {
            if (context.token) {
                const userProduct: Partial<Product> = {
                    _id: productId,
                    amount: selectedAmount
                };
                UserCart.updateUsersProductsCache(userProduct, context.token);
                pubsub.publish(trigger, {
                    productUpdated: getUpdatedProductAmount(context.token, productId)
                });
                return getUpdatedProductAmount(context.token, productId);
            }
        },
        checkout: async (_, args, context) => {
            if (context.token) {
                const usersProducts = UserCart.getUsersProducts();
                const checkoutResponse = await queries.checkoutProductQuery(usersProducts[context.token]);
                UserCart.deleteUserCart(context.token);
                if (checkoutResponse instanceof Error) {
                    return null;
                }
                return checkoutResponse;
            }
            return null;
        }
    },
    Subscription: {
        productUpdated: {
            subscribe: updateProduct
        }
    }
};
