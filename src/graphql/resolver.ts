import * as queries from "../db/db-queries";
import * as jwt from "jsonwebtoken";
import * as UserCart from '../socket/cart';
import {getUpdatedProductsAmount} from '../socket/cart';
import {getUpdatedProductAmount} from "../socket/socket-controllers";
import {Product} from "../models/product";
import {AuthenticationError, PubSub} from 'apollo-server-koa';

const pubsub = new PubSub();
const trigger = 'PRODUCT_UPDATED';

const updateProduct = () => pubsub.asyncIterator([trigger]);
const authenticationError = () => {
    throw new AuthenticationError('must authenticate');
};
const publishUpdatedProduct = (updatedProduct) =>
    pubsub.publish(trigger, {productUpdated: updatedProduct});

export const resolvers = {
    Product: {
        id: (root) => root._id,
        amount: async (root, args, context) => {
            const updatedProductAmount =
                await getUpdatedProductAmount(context.token, root.id);
            return updatedProductAmount.amount;
        }
    },
    Query: {
        getProducts: async (_, args, context) => {
            if (context.token) {
                return getUpdatedProductsAmount(await queries.findProductsQuery());
            }
            authenticationError();
        },
        getProduct: async (_, {id}, context) => context.token ?
            await queries.findProductByIdQuery(id) : authenticationError()
    },
    Mutation: {
        addProduct: async (_, {product}, context) => {
            if (context.token) {
                const newProduct = await queries.addProductQuery(product);
                await publishUpdatedProduct(newProduct.toObject());
                return newProduct;
            }
            authenticationError();
        },
        deleteProduct: async (_, {id}, context) => {
            if (context.token) {
                const deletedProduct = await queries.deleteProductQuery(id);
                await publishUpdatedProduct(deletedProduct.toObject());
                return deletedProduct;
            }
            authenticationError();
        },
        login: () => {
            const token = jwt.sign({username: "ado"}, 'supersecret', {expiresIn: 1000});
            UserCart.createUserCart(token);
            return token;
        },
        updateProductAmount: async (_, {productId, selectedAmount}, context) => {
            if (context.token) {
                const userProduct: Partial<Product> = {
                    _id: productId,
                    amount: selectedAmount
                };
                UserCart.updateUsersProductsCache(userProduct, context.token);
                const dbProduct = await queries.findProductByIdQuery(productId);
                await publishUpdatedProduct(dbProduct);
                return dbProduct;
            }
            authenticationError();
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
            authenticationError();
        }
    },
    Subscription: {
        productUpdated: {
            subscribe: updateProduct
        }
    }
};
