import * as mongoose from "mongoose";
import {ConnectOptions} from "mongoose";
import {logger} from "../logger/init";
import {app} from "../index";
import * as nconf from 'nconf';

export const initDb = () => {
    mongoose.connect(nconf.get('db:connectionString'), nconf.get('db:options') as ConnectOptions
    ).then(() => logger.log('info', 'successfully connected to db'), err => {
        app.use(ctx => ctx.internalServerError());
        logger.log('error', err.message);
    });
};
