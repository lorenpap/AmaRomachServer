import * as Router from '@koa/router';
import ProductsControllers from '../db/products-controllers';

const productsControllers = new ProductsControllers();

const router: Router = new Router({
    prefix: '/Products'
});

router.get('/', productsControllers.getProducts);
router.post('/', productsControllers.addProduct);
router.get('/:id', productsControllers.getProductById);
router.delete('/:id', productsControllers.deleteProduct);
router.put('/:id', productsControllers.updateProduct);
export default router;
