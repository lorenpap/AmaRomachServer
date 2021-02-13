import {gql} from "apollo-server";

export const typeDefs = gql`
type Product {
    name: String!,
    amount: Int!,
    description: String!,
    price: Int!,
    _id: ID!

}

input ProductInput {
    name: String!,
    amount: Int!,
    description: String!,
    price: Int!
}

input UpdatedProductInput {
    name: String,
    amount: Int,
    description: String,
    price: Int,
}

type Query {
    getProducts: [Product!],
    getProduct(_id: ID): Product!
}

type Mutation {
    addProduct(product: ProductInput): Product!,
    deleteProduct(_id: ID): Product!,
    login: ID!,
    updateProductAmount(productId: ID, selectedAmount: Int): Product,
    checkout: [Product!]
}`;
