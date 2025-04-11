import { Router, Request, Response, RequestHandler } from 'express';
import { createFailedProduct, getAllFailedProducts, getFailedProductById, updateFailedProductById, deleteFailedProductById } from './controllers/failedProductController';
import { loginAdmin } from './controllers/authController'; 
import { verifyToken, isAdmin } from './middleware/authMiddleware';

const router: Router = Router();

// Define the routes
router.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to the OnlyFails API!');
});

router.post('/failed-products', verifyToken, isAdmin, createFailedProduct);
router.get('/failed-products', getAllFailedProducts);
router.get('/failed-products/:id', getFailedProductById);
router.put('/failed-products/:id', verifyToken, isAdmin, updateFailedProductById);
router.delete('/failed-products/:id', verifyToken, isAdmin, deleteFailedProductById);
//Admin login route
router.post('/auth/admin/login', loginAdmin as RequestHandler);

export default router;