import * as Router from '@koa/router';
import * as ProductsControllers from '../controllers/products-controllers';
import {updateProductValidation, addProductValidation} from "./addProductValidation";
import {dbStatus} from "./dbValidation";

export const router: Router = new Router({
    prefix: '/Products'
});
router.use(dbStatus);
router.get('/', ProductsControllers.getProducts);
router.post('/', addProductValidation, ProductsControllers.addProduct);
router.get('/:id', ProductsControllers.getProductById);
router.delete('/:id', ProductsControllers.deleteProduct);
router.put('/:id', updateProductValidation, ProductsControllers.updateProduct);

