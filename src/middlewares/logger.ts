import {logger} from "../logger/init";

export const log = async (ctx, next) => {
    const method = ctx.method;
    const url = ctx.url;
    logger.log('info', method + ':' + url);
    await next();
};
