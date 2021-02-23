import './init';
import * as Koa from "Koa";
import * as bodyParser from 'koa-bodyparser';
import * as respond from 'koa-respond';
import {errorHandler} from "./http/middlewares/error-handler";
import *  as nconf from 'nconf';
import {router} from "./http/middlewares/route";
import {log} from "./http/middlewares/logger";
import {initDb} from "./db/init";
import * as cors from '@koa/cors';
import {ApolloServer, AuthenticationError} from "apollo-server-koa";
import {resolvers} from "./graphql/resolver";
import {typeDefs} from "./graphql/type-defs";
import * as jwt from "jsonwebtoken";
import {Server} from "socket.io";
import * as UserCart from "./utils/cart";
import * as cookieParser from 'socket.io-cookie-parser';
import {updateCart} from "./socket/socket-controllers";
import {ProductSelectedAmount} from "./models/productAmount";

export const app: Koa = new Koa();

const apolloServer = new ApolloServer({
    typeDefs, resolvers, playground: true,
    subscriptions: {
        path: "/graphql",
        onConnect: async (connectionParams, webSocket, context) => {
            console.log(`Subscription client connected using Apollo server's built-in SubscriptionServer.`);
        },
        onDisconnect: async (webSocket, context) => {
            console.log(`Subscription client disconnected.`);
        }
    },
    context: context => {
        const token = context.ctx ? context.ctx.request.header.authorization : '';
        if (token) {
            jwt.verify(token, 'supersecret', async (err, decoded) => {
                if (err) {
                    return null;
                }
            });
            return {token};
        }
        throw new AuthenticationError('must authenticate');
    }
});

const port = nconf.get('app:port');
const options = {
    credentials: true
};

app.use(errorHandler).use(log).use(cors(options)).use(respond()).use(bodyParser()).use(router.routes());

const io = new Server(null);
io.use(cookieParser());

io.on('connection', (socket) => {
    console.log('a user connected, id:', socket.id);
    UserCart.createUserCart(socket.request.cookies.token);

    socket.on('disconnect', () => {
        console.log('user disconnected, id:', socket.id);
        UserCart.deleteUserCart(socket.request.cookies.token);
    });
    socket.on('update product amount', async (productAmount: ProductSelectedAmount) => {
        await updateCart(socket, productAmount, socket.request.cookies.token);
    });
});
apolloServer.applyMiddleware({app, cors: false});

const server =
    app.listen(port, () => {
            console.log(`🚀 Subscription endpoint ready at ws://localhost:${port}${apolloServer.subscriptionsPath}`);
            console.log(`✅  The server is running at http://localhost:${port}${apolloServer.graphqlPath}`);
            initDb();
        }
    );
apolloServer.installSubscriptionHandlers(server);
