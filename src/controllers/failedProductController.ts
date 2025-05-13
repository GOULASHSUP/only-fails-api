import { Request, Response, RequestHandler } from 'express';
import { FailedProductModel } from '../models/failedProductModel';
import { connect, disconnect } from '../repository/database';

/**
 * Create a new failed product
 * @param req
 * @param res
 */
export async function createFailedProduct(req: Request, res: Response): Promise<void> {
    const data = req.body;
    try {
        await connect();

        console.log('[createFailedProduct] Incoming data:', data);
        console.log('[createFailedProduct] Authenticated user:', (req as any).user);

        const failedProduct = new FailedProductModel({
            ...data,
            _createdBy: (req as any).user?.id,
        });

        // Save product to database
        const result = await failedProduct.save();
        res.status(201).send(result);
    }
    catch (err) {
        console.error('[createFailedProduct] Error creating failed product:', err);
        res.status(500).send("Error creating failed product. Error: " + err);
    }
    finally {
        await disconnect();
    }
}

/**
 * Get all the failed products
 * @param req
 * @param res
 */
export async function getAllFailedProducts(req: Request, res: Response) {
    try {
        await connect();
        const result = await FailedProductModel.find({});
        res.status(200).send(result);
    }
    catch (err) {
        res.status(500).send("Error retrieving failed products: " + err);
    }
    finally {
        await disconnect();
    }
}

/**
 * Get a single failed products by it's id
 * @param req
 * @param res
 */
export async function getFailedProductById(req: Request, res: Response) {
    try {
        await connect();
        const id = req.params.id;
        const result = await FailedProductModel.findById(id);

        if (!result) {
            res.status(404).send("Failed product not found.");
            return;
        }

        res.status(200).json(result);
    }
    catch (err) {
        console.error("[getFailedProductById] Error:", err);
        res.status(500).send("Error retrieving failed product: " + err);
    }
    finally {
        await disconnect();
    }
}

/**
 * Update a single failed products by it's id
 * @param req
 * @param res
 */
export async function updateFailedProductById(req: Request, res: Response) {
    const id = req.params.id;
    try {
        await connect();
        const result = await FailedProductModel.findByIdAndUpdate(id, req.body);
        if (!result) {
            res.status(404).send("Cannot update failed product with id: " + id);
        }
        else {
            res.status(200).send("Failed product with id: " + id + " was updated successfully");
        }
    }
    catch (err) {
        res.status(500).send("Error updating failed product by ID: " + err);
    }
    finally {
        await disconnect();
    }
}

/**
 * Update a single failed products by it's id
 * @param req
 * @param res
 */
export async function deleteFailedProductById(req: Request, res: Response) {
    const id = req.params.id;
    try {
        await connect();
        // Look up product by ID
        const result = await FailedProductModel.findByIdAndDelete(id);
        if (!result) {
            res.status(404).send("Cannot delete failed product with id: " + id);
        }
        else {
            res.status(200).send("Failed product with id: " + id + " was deleted successfully");
        }
    }
    catch (err) {
        res.status(500).send("Error updating failed product by ID: " + err);
    }
    finally {
        await disconnect();
    }
}
/**
 * Vote on a failed product (upvote or downvote)
 * @param req
 * @param res
 */
export const voteOnFailedProduct: RequestHandler = async (req, res) => {
    const productId = req.params.id;
    const { voteType } = req.body;

    if (!['upvote', 'downvote'].includes(voteType)) {
        res.status(400).send("Invalid voteType: must be 'upvote' or 'downvote'.");
        return;
    }

    try {
        await connect();

        const failedProduct = await FailedProductModel.findById(productId);
        if (!failedProduct) {
            res.status(404).send("Failed product not found.");
            return;
        }

        failedProduct.upvotes = failedProduct.upvotes || 0;
        failedProduct.downvotes = failedProduct.downvotes || 0;

        // Apply the vote
        if (voteType === 'upvote') {
            failedProduct.upvotes += 1;
        } else {
            failedProduct.downvotes += 1;
        }

        // Save and return updated product
        const updatedProduct = await failedProduct.save();
        res.status(200).json(updatedProduct);

    } catch (err) {
        console.error("Error voting on failed product:", err);
        res.status(500).send("Error voting on failed product.");
    } finally {
        await disconnect();
    }
};