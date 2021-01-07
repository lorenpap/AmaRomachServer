import {logger} from "../logger/logger";

export const errorHandler = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        if (err.name === 'CastError' || err.name === 'NotFoundError' || err.name === 'BadRequestError') {
            ctx.badRequest();
            logger.log('error', err.message);
            return;
        }
        ctx.internalServerError();
        logger.log('error', err.message);
    }
};
