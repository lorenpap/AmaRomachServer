import * as Router from '@koa/router';
import * as ProductsControllers from '../db/products-controllers';
import {partialValidation, validation} from "./validation";

export const router: Router = new Router({
    prefix: '/Products'
});

router.get('/', ProductsControllers.getProducts);
router.post('/', validation, ProductsControllers.addProduct);
router.get('/:id', ProductsControllers.getProductById);
router.delete('/:id', ProductsControllers.deleteProduct);
router.put('/:id', partialValidation, ProductsControllers.updateProduct);
