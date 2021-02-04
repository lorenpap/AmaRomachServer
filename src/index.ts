import './init';
import * as Koa from "Koa";
import * as bodyParser from 'koa-bodyparser';
import * as respond from 'koa-respond';
import {errorHandler} from "./http/middlewares/error-handler";
import *  as nconf from 'nconf';
import {router} from "./http/middlewares/route";
import {log} from "./http/middlewares/logger";
import {initDb} from "./db/init";
import {Server} from "socket.io";
import * as http from 'http';
import * as cors from '@koa/cors';
import {ProductSelectedAmount} from "./models/productAmount";
import {updateCart} from "./socket/socket-controllers";
import * as UserCart from "./socket/cart";

export const app: Koa = new Koa();

const port = nconf.get('app:port');
const options = {
    credentials: true
};
app.use(errorHandler)
    .use(log).use(cors(options)).use(respond()).use(bodyParser()).use(router.routes());
const server = http.createServer(app.callback());
const io = new Server(server);

io.on('connection', (socket) => {

    console.log('a user connected, id:', socket.id);
    UserCart.createUserCart(socket.request.headers.cookie);

    socket.on('disconnect', () => {
        console.log('user disconnected, id:', socket.id);
        UserCart.deleteUserCart(socket.request.headers.cookie);
    });
    socket.on('update product amount', async (productAmount: ProductSelectedAmount) => {
        await updateCart(socket, productAmount, socket.request.headers.cookie);
    });
});

server.listen(port, () => {
        console.log(`✅  The server is running at http://localhost:${port}/`);
        initDb();
    }
);
