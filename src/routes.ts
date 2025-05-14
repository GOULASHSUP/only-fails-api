import { Router, Request, Response } from 'express';
import { createFailedProduct, getAllFailedProducts, getFailedProductById, updateFailedProductById, deleteFailedProductById, voteOnFailedProduct } from './controllers/failedProductController';
import { loginAdmin } from './controllers/authController';
import { registerUser, loginUser } from './controllers/userController';  
import { verifyToken, isAdmin } from './middleware/authMiddleware';
import { addCommentToFailedProduct } from './controllers/commentController';  

const router: Router = Router();

// Define the routes
/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     responses:
 *       200:
 *         description: Welcome message
 */
router.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to the OnlyFails API!');
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post('/auth/register', registerUser);  

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/auth/login', loginUser);  

// Admin-only routes (protected by verifyToken and isAdmin)
/**
 * @swagger
 * /failed-products:
 *   post:
 *     summary: Create a new failed product
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, category, startDate, failureDate, description, designedBy, imageURL]
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               failureDate:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               designedBy:
 *                 type: string
 *               imageURL:
 *                 type: string
 *     responses:
 *       201:
 *         description: Failed product created successfully
 */
router.post('/failed-products', verifyToken, isAdmin, createFailedProduct);

/**
 * @swagger
 * /failed-products:
 *   get:
 *     summary: Get all failed products
 *     responses:
 *       200:
 *         description: List of all failed products
 */
router.get('/failed-products', getAllFailedProducts);

/**
 * @swagger
 * /failed-products/{id}:
 *   get:
 *     summary: Get a failed product by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the failed product
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A failed product
 *       404:
 *         description: Product not found
 */
router.get('/failed-products/:id', getFailedProductById);

/**
 * @swagger
 * /failed-products/{id}:
 *   put:
 *     summary: Update a failed product by ID
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the failed product
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, category, startDate, failureDate, description, designedBy, imageURL]
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               failureDate:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               designedBy:
 *                 type: string
 *               imageURL:
 *                 type: string
 *     responses:
 *       200:
 *         description: Failed product updated successfully
 *       404:
 *         description: Product not found
 */
router.put('/failed-products/:id', verifyToken, isAdmin, updateFailedProductById);

/**
 * @swagger
 * /failed-products/{id}:
 *   delete:
 *     summary: Delete a failed product by ID
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the failed product
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Failed product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete('/failed-products/:id', verifyToken, isAdmin, deleteFailedProductById);

// Add vote route
/**
 * @swagger
 * /failed-products/{id}/vote:
 *   post:
 *     summary: Vote on a failed product (upvote or downvote)
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the failed product
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               voteType:
 *                 type: string
 *                 enum: ['upvote', 'downvote']
 *                 description: Type of vote (upvote or downvote)
 *     responses:
 *       200:
 *         description: Successfully voted on the product
 *       400:
 *         description: Invalid vote type
 *       404:
 *         description: Failed product not found
 */
router.post('/failed-products/:id/vote', verifyToken, voteOnFailedProduct);

// Add comment route
/**
 * @swagger
 * /failed-products/{id}/comment:
 *   post:
 *     summary: Add a comment to a failed product
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the failed product
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The comment text
 *                 example: "This product failed because of XYZ reason"
 *     responses:
 *       201:
 *         description: Successfully added comment
 *       400:
 *         description: Comment text is required
 *       404:
 *         description: Failed product not found
 */
router.post('/failed-products/:id/comment', verifyToken, addCommentToFailedProduct);

/**
 * @swagger
 * /auth/admin/login:
 *   post:
 *     summary: Admin login to get the JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@onlyfails.com"
 *               password:
 *                 type: string
 *                 example: "admin123456"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for the logged-in admin
 *       401:
 *         description: Invalid credentials
 */
router.post('/auth/admin/login', loginAdmin);

export default router;