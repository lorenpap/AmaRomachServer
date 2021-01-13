import './init';
import * as Koa from "Koa";
import * as bodyParser from 'koa-bodyparser';
import * as respond from 'koa-respond';
import {errorHandler} from "./http/middlewares/error-handler";
import *  as nconf from 'nconf';
import {router} from "./http/middlewares/route";
import {log} from "./http/middlewares/logger";
import {initDb} from "./db/init";
import {accessControl} from "./http/middlewares/access-control";

export const app: Koa = new Koa();
const port = nconf.get('app:port');

app.use(errorHandler).use(log).use(respond()).use(bodyParser()).use(router.routes()).use(accessControl);
app.listen(port, () => {
        console.log(`✅  The server is running at http://localhost:${port}/`);
        initDb();
    }
);
