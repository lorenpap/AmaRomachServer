import * as Koa from "Koa";
import * as mongoose from 'mongoose';
import router from "../middlewares/route";
import * as bodyParser from 'koa-bodyparser';
import * as respond from 'koa-respond';
import {logger} from "../middlewares/logger";
import * as config from '../middlewares';
import {errorHandler} from "../middlewares/error-handler";

const app = new Koa();

mongoose.connect(config.default.get('db:connectionString'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => logger.log('info', 'successfully connected to db')).catch(err => {
    app.use(ctx => ctx.internalServerError(err));
    logger.log('error', 'failed connecting to db');
});

app.use(respond()).use(errorHandler).use(bodyParser()).use(router.routes());
app.listen(config.default.get('app:port'), () => console.log(`✅  The server is running at http://localhost:${config.default.get('app:port')}/`)
);

export default app;
