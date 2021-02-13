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
import {ApolloServer} from "apollo-server-koa";
import {resolvers} from "./graphql/resolver";
import {typeDefs} from "./graphql/type-defs";
import * as jwt from "jsonwebtoken";

export const app: Koa = new Koa();

const apolloServer = new ApolloServer({
    typeDefs, resolvers
    , context: context => {
        const token = context.ctx.request.header.authorization;
        if (token) {
            jwt.verify(token, 'supersecret', async (err, decoded) => {
                if (err) {
                    console.log(err);
                    return null;
                }
            });
            return {token};
        }
        return null
    }
});

const port = nconf.get('app:port');
const options = {
    credentials: true
};
app.use(errorHandler).use(log).use(cors(options)).use(respond()).use(bodyParser()).use(router.routes());
// const server = http.createServer(app.callback());
// apolloServer.applyMiddleware({app});
// const io = new Server(server);
// io.use(cookieParser());

// io.on('connection', (socket) => {
//     console.log('a user connected, id:', socket.id);
//     UserCart.createUserCart(socket.request.cookies.token);

//     socket.on('disconnect', () => {
//         console.log('user disconnected, id:', socket.id);
//         UserCart.deleteUserCart(socket.request.cookies.token);
//     });
//     socket.on('update product amount', async (productAmount: ProductSelectedAmount) => {
//         await updateCart(socket, productAmount, socket.request.cookies.token);
//     });
// });
apolloServer.applyMiddleware({app, cors: false});
app.listen(port, () => {
        console.log(`✅  The server is running at http://localhost:${port}${apolloServer.graphqlPath}`);
        initDb();
    }
);
