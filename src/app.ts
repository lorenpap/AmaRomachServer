import * as Koa from "Koa";
import {connectionString, port} from "./config";
import * as mongoose from 'mongoose';
import router from "./route";
import * as bodyParser from 'koa-bodyparser';

const app = new Koa();

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).catch(err => console.log(err));

app.use(bodyParser()).use(router.routes());
app.listen(port, () => console.log(`✅  The server is running at http://localhost:${port}/`)
);

export default app;
