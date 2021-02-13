import * as queries from "../db/db-queries";
import * as jwt from "jsonwebtoken";
import * as UserCart from '../socket/cart';
import {getUpdatedProductsAmount} from '../socket/cart';
import {getUpdatedProductAmount} from "../socket/socket-controllers";
import {Product} from "../models/product";

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
        addProduct: (parent, {product}, context, info) => context.token ? queries.addProductQuery(product) : null,
        deleteProduct: async (parent, {_id}, context, info) =>
            context.token ? await queries.deleteProductQuery(_id) : null,
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
                return getUpdatedProductAmount(context.token, productId);
            }
        },
        checkout: (parent, args, context, info) => {
            if (context.token) {
                const usersProducts = UserCart.getUsersProducts();
                return queries.checkoutProductQuery(usersProducts[context.token]).then(checkoutResponse => {
                    UserCart.deleteUserCart(context.token);
                    if (checkoutResponse instanceof Error) {
                        throw (context.throw(500, 'checkout error'));
                    }
                    return checkoutResponse;
                });
            }
            return null;
        }
    }
};
