import { Router, Request, Response } from 'express';

const router: Router = Router();

// Define the routes
router.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to the OnlyFails API!');
});

export default router;