import { Request, Response } from 'express';
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
        const failedProduct = new FailedProductModel(data);
        const result = await failedProduct.save();
        res.status(201).send(result);
    }
    catch (err) {
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