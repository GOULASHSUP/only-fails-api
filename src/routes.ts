import { Router, Request, Response } from 'express';
import { createFailedProduct, getAllFailedProducts, getFailedProductById, updateFailedProductById, deleteFailedProductById, voteOnFailedProduct } from './controllers/failedProductController';
import { loginAdmin } from './controllers/authController';
import { registerUser, loginUser } from './controllers/userController';  
import { verifyToken, isAdmin } from './middleware/authMiddleware';
import { addCommentToFailedProduct } from './controllers/commentController';  

const router: Router = Router();

// Define the routes
router.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to the OnlyFails API!');
});

// User registration and login routes
router.post('/auth/register', registerUser);  
router.post('/auth/login', loginUser);  

// Admin-only routes (protected by verifyToken and isAdmin)
router.post('/failed-products', verifyToken, isAdmin, createFailedProduct);
router.get('/failed-products', getAllFailedProducts);
router.get('/failed-products/:id', getFailedProductById);
router.put('/failed-products/:id', verifyToken, isAdmin, updateFailedProductById);
router.delete('/failed-products/:id', verifyToken, isAdmin, deleteFailedProductById);

// Add vote route
router.post('/failed-products/:id/vote', verifyToken, voteOnFailedProduct);

// Add comment route
router.post('/failed-products/:id/comment', verifyToken, addCommentToFailedProduct);

// Admin login route (no registration allowed for admin)
router.post('/auth/admin/login', loginAdmin);

export default router;