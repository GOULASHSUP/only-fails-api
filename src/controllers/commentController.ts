// IMPORTANT: This file currently is unused, since the commenting functionality is not done on the frontend.
// It is kept here for future reference and to be used when the frontend is ready.

import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { Request, Response } from 'express';
import { FailedProductModel } from '../models/failedProductModel';
import { connect, disconnect } from '../repository/database';

export const addCommentToFailedProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { text } = req.body;
    const productId = req.params.id;
    const userId = req.user?.id;

    if (!text) {
        res.status(400).send("Comment text is required.");
        return;
    }

    if (!userId) {
        res.status(401).send("Unauthorized: User must be logged in to comment.");
        return;
    }

    try {
        await connect();

        const failedProduct = await FailedProductModel.findById(productId);
        if (!failedProduct) {
            res.status(404).send("Failed product not found.");
            return;
        }

        failedProduct.comments.push({
            userId: userId as string,
            text,
            date: new Date(),
        });

        const updatedProduct = await failedProduct.save();
        res.status(201).json(updatedProduct);

    } catch (err) {
        console.error("Error adding comment:", err);
        res.status(500).send("Error adding comment to failed product.");
    } finally {
        await disconnect();
    }
};