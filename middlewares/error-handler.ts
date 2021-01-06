import {logger} from "./logger";

export const errorHandler = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        if (err.name === 'CastError' || err.name === 'NotFoundError') {
            ctx.throw(400, 'Bad Request');
            logger.log('error', err.message);
            return;
        }
        ctx.throw(500, 'Internal Server Error');
        logger.log('error', err.message);
    }
};
