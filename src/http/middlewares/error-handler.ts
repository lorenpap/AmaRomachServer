import {logger} from "../../logger/init";

export const errorHandler = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        if (err.name === 'CastError' || err.name === 'NotFoundError' || err.name === 'BadRequestError') {
            ctx.badRequest(err.message);
            logger.log('error', err.message);
            return;
        }
        ctx.internalServerError(err.message);
        logger.log('error', err.message);
    }
};
