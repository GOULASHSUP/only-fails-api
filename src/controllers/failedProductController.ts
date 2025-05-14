import { Request, Response, RequestHandler } from 'express';
import { FailedProductModel } from '../models/failedProductModel';
import { connect, disconnect } from '../repository/database';
import { UserModel } from '../models/userModel';

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
    const userId = (req as any).user?.id;
    const productId = req.params.id;
    const { voteType } = req.body;

    if (!['upvote', 'downvote'].includes(voteType)) {
        res.status(400).send("Invalid voteType: must be 'upvote' or 'downvote'.");
        return;
    }

    try {
        await connect();
        const user = await UserModel.findById(userId);
        const failedProduct = await FailedProductModel.findById(productId);

        if (!user || !failedProduct) {
            res.status(404).send("User or product not found.");
            return;
        }

        const alreadyVoted = user.votes.find((v: { productId: any }) => v.productId.toString() === productId);
        if (alreadyVoted) {
            res.status(403).send("You have already voted on this product.");
            return;
        }

        if (voteType === 'upvote') failedProduct.upvotes++;
        else failedProduct.downvotes++;

        user.votes.push({ productId, voteType });

        await failedProduct.save();
        await user.save();

        res.status(200).json(failedProduct);
    } catch (err) {
        console.error("Voting error:", err);
        res.status(500).send("Internal server error.");
    } finally {
        await disconnect();
    }
};