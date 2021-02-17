import * as queries from "../db/db-queries";
import * as jwt from "jsonwebtoken";
import * as UserCart from '../socket/cart';
import {getUpdatedProductsAmount} from '../socket/cart';
import {getUpdatedProductAmount} from "../socket/socket-controllers";
import {Product} from "../models/product";
import {PubSub} from 'apollo-server-koa';

const pubsub = new PubSub();

export const updateProduct = (parent, {product}, context) => {
    return pubsub.asyncIterator(['PRODUCT_UPDATED']);
};
export const resolvers = {

    Query: {
        getProducts: (parent, args, context, info) => {
            if (context.token) {
                return queries.findProductsQuery().then(dbProducts => {
                    return getUpdatedProductsAmount(dbProducts);
                });
            }
            return null;
        },
        getProduct: (parent, {_id}, context, info) => context.token ? queries.findProductByIdQuery(_id) : null
    },
    Mutation: {
        addProduct: (parent, {product}, context, info) => {
            if (context.token) {
                return queries.addProductQuery(product).then(newProduct => {
                    pubsub.publish('PRODUCT_UPDATED', {
                        productUpdated: newProduct.toObject()
                    });
                    return newProduct;
                });
            }
            return null;
        },
        deleteProduct: async (parent, {_id}, context, info) => {
            if (context.token) {
                return await queries.deleteProductQuery(_id).then(deletedProduct => {
                    pubsub.publish('PRODUCT_UPDATED', {
                        productUpdated: deletedProduct.toObject()
                    });
                    return deletedProduct;
                });
            }
            return null;
        },
        login: () => {
            const token = jwt.sign({username: "ado"}, 'supersecret', {expiresIn: 1000});
            UserCart.createUserCart(token);
            return token;
        },
        updateProductAmount: (parent, {productId, selectedAmount}, context, info) => {
            if (context.token) {
                const userProduct: Partial<Product> = {
                    _id: productId,
                    amount: selectedAmount
                };
                UserCart.updateUsersProductsCache(userProduct, context.token);
                pubsub.publish('PRODUCT_UPDATED', {
                    productUpdated: getUpdatedProductAmount(context.token, productId)
                });
                return getUpdatedProductAmount(context.token, productId);
            }
        },
        checkout: (parent, args, context, info) => {
            if (context.token) {
                const usersProducts = UserCart.getUsersProducts();
                return queries.checkoutProductQuery(usersProducts[context.token]).then(checkoutResponse => {
                    UserCart.deleteUserCart(context.token);
                    if (checkoutResponse instanceof Error) {
                        return null;
                    }
                    checkoutResponse.forEach(product => {
                        pubsub.publish('PRODUCT_UPDATED', {
                            productUpdated: product.toObject()
                        });
                    });
                    return checkoutResponse;
                });
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
