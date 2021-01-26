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
import {getUpdatedProductAmount, updateProductAmount} from "./socket/socket-controllers";
import {BaseProduct} from "./models/product";

export const app: Koa = new Koa();

const port = nconf.get('app:port');
const options = {
    origin: '*'
};
app.use(errorHandler)
    .use(cors(options)).use(log).use(respond()).use(bodyParser()).use(router.routes()).use(accessControl);
const server = http.createServer(app.callback());
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('update product amount', async (productAmount: ProductSelectedAmount) => {
        await updateProductAmount(socket.id, productAmount).then(() => {
            const updatedProduct: BaseProduct = getUpdatedProductAmount(socket.id, productAmount.productId);
            socket.broadcast.emit('updatedProduct', updatedProduct);
        });
    });
});

server.listen(port, () => {
        console.log(`✅  The server is running at http://localhost:${port}/`);
        initDb();
    }
);
