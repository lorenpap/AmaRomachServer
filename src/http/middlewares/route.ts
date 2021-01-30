import * as Router from '@koa/router';
import * as ProductsControllers from '../controllers/products-controllers';
import {addProductValidation, updateProductValidation} from "./addProductValidation";
import {dbStatus} from "./dbValidation";
import {socketValidation} from "../../socket/socket-validation";

export const router: Router = new Router({
    prefix: '/products'
});
router.use(dbStatus);
router.get('/', ProductsControllers.getProducts, ProductsControllers.updateProductsAmount);
router.post('/', addProductValidation, ProductsControllers.addProduct);
router.get('/:id', ProductsControllers.getProductById);
router.delete('/:id', ProductsControllers.deleteProduct);
router.put('/:id', updateProductValidation, ProductsControllers.updateProduct);
router.post('/checkout', socketValidation, ProductsControllers.checkout);
