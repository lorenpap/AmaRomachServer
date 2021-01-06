import * as Router from '@koa/router';
import ProductsControllers from '../db/products-controllers';

const productsControllers = new ProductsControllers();

const router: Router = new Router({
    prefix: '/Products'
});

router.get('/', ctx => productsControllers.getProducts(ctx));
router.post('/', ctx => productsControllers.addProduct(ctx));
router.get('/:id', ctx => productsControllers.getProductById(ctx));
router.delete('/:id', ctx => productsControllers.deleteProduct(ctx));
router.put('/:id', ctx => productsControllers.updateProduct(ctx));
export default router;
