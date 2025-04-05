import { Router, Request, Response } from 'express';
import { createFailedProduct, getAllFailedProducts, getFailedProductById, updateFailedProductById, deleteFailedProductById } from './controllers/failedProductController';

const router: Router = Router();

// Define the routes
router.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to the OnlyFails API!');
});

router.post('/failed-products', createFailedProduct);
router.get('/failed-products', getAllFailedProducts);
router.get('/failed-products/:id', getFailedProductById);
router.put('/failed-products/:id', updateFailedProductById);
router.delete('/failed-products/:id', deleteFailedProductById);

export default router;