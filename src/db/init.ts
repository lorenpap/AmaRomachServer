import * as mongoose from "mongoose";
import {ConnectOptions} from "mongoose";
import * as nconf from 'nconf';
import {logger} from "../logger/init";

export const initDb = async () => {
    try {
        await mongoose.connect(nconf.get('db:connectionString'), nconf.get('db:options') as ConnectOptions);
        logger.log('info', 'successfully connected to db');
    } catch (e) {
        logger.log('error', e.message);
    }

};
