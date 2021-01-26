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
import {Server} from "socket.io";
import * as http from 'http';
import * as cors from '@koa/cors';
import {ProductSelectedAmount} from "./models/productAmount";
import {updateCart} from "./socket/socket-controllers";

export const app: Koa = new Koa();

const port = nconf.get('app:port');
const options = {
    origin: '*'
};
app.use(errorHandler)
    .use(log).use(cors(options)).use(respond()).use(bodyParser()).use(router.routes()).use(accessControl);
const server = http.createServer(app.callback());
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected, id:', socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected, id:', socket.id);
    });
    socket.on('update product amount', async (productAmount: ProductSelectedAmount) => {
        await updateCart(socket, productAmount);
    });
});

server.listen(port, () => {
        console.log(`✅  The server is running at http://localhost:${port}/`);
        initDb();
    }
);
