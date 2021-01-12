// import {Document} from "mongoose";

import {MongooseDocument} from "mongoose";

export interface Product extends MongooseDocument{
    name: string;
    description: string;
    price: number;
    amount: number;
}
