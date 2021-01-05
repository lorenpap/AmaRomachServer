import * as Koa from "Koa";
import {connectionString, port} from "./config";
import * as mongoose from 'mongoose';
import router from "./route";
import * as bodyParser from 'koa-bodyparser';
import * as respond from 'koa-respond';
import {logger} from "./logger";

const app = new Koa();

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => logger.log('info', 'successfully connected to db')).catch(err => {
    app.use(ctx => ctx.internalServerError(err));
    logger.log('error', 'failed connecting to db');
});

app.use(respond()).use(bodyParser()).use(router.routes());
app.listen(port, () => console.log(`✅  The server is running at http://localhost:${port}/`)
);

export default app;
