import * as jwt from 'jsonwebtoken';

export const socketValidation = async (ctx, next) => {
    const token = ctx.request.body.id;
    jwt.verify(token, 'supersecret', async (err, decoded) => {
        if (err) {
            throw(ctx.throw(400, 'wrong token'));
        }
    });
    await next();
};
