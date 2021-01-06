import {logger} from "./logger";

export const errorHandler = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        if (err.name === 'CastError' || err.name === 'NotFoundError') {
            ctx.badRequest();
            logger.log('error', err.message);
            return;
        }
        ctx.internalServerError();
        console.log(err.name);
        logger.log('error', err.message);
    }
};
