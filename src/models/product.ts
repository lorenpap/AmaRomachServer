import {Document} from "mongoose";

export interface Product {
    name: string;
    description: string;
    price: number;
    amount: number;
}

export type DbProduct = Promise<Document<Product>>;
