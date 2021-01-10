import './init';
import * as Koa from "Koa";
import * as bodyParser from 'koa-bodyparser';
import * as respond from 'koa-respond';
import {errorHandler} from "./middlewares/error-handler";
import *  as nconf from 'nconf';
import {initDb} from "./db/init";
import {router} from "./middlewares/route";
import {log} from "./middlewares/logger";

export const app: Koa = new Koa();


app.use(errorHandler).use(log).use(respond()).use(bodyParser()).use(router.routes());
app.listen(nconf.get('app:port'), () => {
        console.log(`✅  The server is running at http://localhost:${nconf.get('app:port')}/`);
        initDb();
    }
);
