import { Router, Request, Response } from 'express';
import { createFailedProduct, getAllFailedProducts } from './controllers/failedProductController';
import { get } from 'http';

const router: Router = Router();

// Define the routes
router.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to the OnlyFails API!');
});

router.post('/failed-products', createFailedProduct);
router.get('/failed-products', getAllFailedProducts);

export default router;