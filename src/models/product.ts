import {Document} from "mongoose";

export interface Product extends Document {
    name: string;
    description: string;
    price: number;
    amount: number;
}

export interface BaseProduct {
    name?: string;
    description?: string;
    price?: number;
    amount?: number;
    _id?: any;
}
