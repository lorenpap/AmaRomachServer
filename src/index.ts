import './init';
import * as Koa from "Koa";
import * as bodyParser from 'koa-bodyparser';
import * as respond from 'koa-respond';
import {errorHandler} from "./middlewares/error-handler";
import *  as nconf from 'nconf';
import {router} from "./middlewares/route";
import {log} from "./middlewares/logger";
import {initDb} from "./db/init";

export const app: Koa = new Koa();
const port = nconf.get('app:port');

app.use(errorHandler).use(respond()).use(bodyParser()).use(router.routes()).use(log);
app.listen(port, () => {
        console.log(`✅  The server is running at http://localhost:${port}/`);
        initDb();
    }
);
