import * as queries from "../db/db-queries";
import * as UserCart from '../utils/cart';
import {getUpdatedProductsAmount} from '../utils/cart';
import {Product} from "../models/product";
import {PubSub} from 'apollo-server-koa';

const pubsub = new PubSub();
const productUpdated = 'PRODUCT_UPDATED';

const updateProduct = () => pubsub.asyncIterator([productUpdated]);

const publishUpdatedProduct = (updatedProduct) =>
    pubsub.publish(productUpdated, {productUpdated: updatedProduct});

const getProducts = async () => {
    return getUpdatedProductsAmount(await queries.findProductsQuery());
};

const getProduct = async (_, {id}) =>
    await queries.findProductByIdQuery(id);

const addProduct = async (_, {product}) => {
    const newProduct = await queries.addProductQuery(product);
    await publishUpdatedProduct(newProduct.toObject());
    return newProduct;
};

const deleteProduct = async (_, {id}) => {
    const deletedProduct = await queries.deleteProductQuery(id);
    await publishUpdatedProduct(deletedProduct.toObject());
    return deletedProduct;

};

const updateProductAmount = async (_, {productId, selectedAmount}, context) => {
    const userProduct: Partial<Product> = {
        _id: productId,
        amount: selectedAmount
    };
    UserCart.updateUsersProductsCache(userProduct, context.token);
    const dbProduct = await queries.findProductByIdQuery(productId);
    await publishUpdatedProduct(dbProduct);
    return dbProduct;
};

const checkout = async (_, args, context) => {
    const usersProducts = UserCart.getUsersProducts();
    const checkoutResponse = await queries.checkoutProductQuery(usersProducts[context.token]);
    UserCart.deleteUserCart(context.token);
    if (checkoutResponse instanceof Error) {
        return null;
    }
    return checkoutResponse;
};

export const resolvers = {
    Product: {
        id: (root) => root._id,
        amount: (root) => UserCart.calculateProductAmount(root._id, root.amount)
    },
    Query: {
        getProducts,
        getProduct
    },
    Mutation: {
        addProduct,
        deleteProduct,
        updateProductAmount,
        checkout
    },
    Subscription: {
        productUpdated: {
            subscribe: updateProduct
        }
    }
};
