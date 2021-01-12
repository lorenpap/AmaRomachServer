import {logger} from "../../logger/init";

export const log = async (ctx, next) => {
    await next();
    const method = ctx.method;
    const url = ctx.url;
    const response = ctx.response;
    logger.log('info', method + ':' + url);
    logger.log('info', response);
};
