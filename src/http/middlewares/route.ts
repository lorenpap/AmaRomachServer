import * as Router from '@koa/router';
import * as ProductsControllers from '../controllers/products-controllers';
import {addProductValidation, updateProductValidation} from "./addProductValidation";
import {dbStatus} from "./dbValidation";
import {tokenValidation} from "./token-validation";
import * as jwt from "jsonwebtoken";
import * as UserCart from "../../utils/cart";

export const router: Router = new Router({
    prefix: '/products'
});
router.use(dbStatus);
router.post('graphqllogin', async (ctx, next) => {
    const token = jwt.sign({username: "ado"}, 'supersecret', {expiresIn: 1000});
    UserCart.createUserCart(token);
    ctx.ok(token);
    await next();
});
router.post('/login', ProductsControllers.login);
router.get('/', ProductsControllers.getProducts, ProductsControllers.updateProductsAmount);
router.post('/', addProductValidation, ProductsControllers.addProduct);
router.get('/:id', ProductsControllers.getProductById);
router.delete('/:id', ProductsControllers.deleteProduct);
router.put('/:id', updateProductValidation, ProductsControllers.updateProduct);
router.post('/checkout', tokenValidation, ProductsControllers.checkout);
