import * as Koa from "Koa";
import * as mongoose from 'mongoose';
import router from "../middlewares/route";
import * as bodyParser from 'koa-bodyparser';
import * as respond from 'koa-respond';
import {logger} from "../middlewares/logger";
import * as config from '../middlewares';
import {errorHandler} from "../middlewares/error-handler";

export const app = new Koa();

const mongooseOptions = {
    useNewUrlParser: config.get('db:options:getNewUrlParser'),
    useUnifiedTopology: config.get('db:options:useUnifiedTopology'),
    useFindAndModify: config.get('db:options:useFindAndModify')
};
mongoose.connect(config.get('db:connectionString'), {
        useNewUrlParser: mongooseOptions.useNewUrlParser,
        useUnifiedTopology: mongooseOptions.useUnifiedTopology,
        useFindAndModify: mongooseOptions.useFindAndModify
    }
).then(() => logger.log('info', 'successfully connected to db'), err => {
    app.use(ctx => ctx.internalServerError(err));
    logger.log('error', err.message);
});

mongoose.connection.on('error', (e) => {
    logger.log('error', e.message);
    app.use(ctx => ctx.internalServerError(e));
});


app.use(respond()).use(errorHandler).use(bodyParser()).use(router.routes());
app.listen(config.get('app:port'), () => console.log(`✅  The server is running at http://localhost:${config.get('app:port')}/`)
);
