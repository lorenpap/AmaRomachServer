import * as mongoose from "mongoose";

export const dbStatus = async (ctx, next) => {
    mongoose.connection.db ? await next() : ctx.throw(500, 'db is not connected');
};
