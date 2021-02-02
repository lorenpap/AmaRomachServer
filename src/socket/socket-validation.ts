import * as jwt from 'jsonwebtoken';

export const socketValidation = async (ctx, next) => {
    console.log(ctx);
    const token = ctx.cookies.get('token');
    jwt.verify(token, 'supersecret', async (err, decoded) => {
        if (err) {
            throw(ctx.throw(400, 'wrong token'));
        }
    });
    ctx.token = token;
    await next();
};
