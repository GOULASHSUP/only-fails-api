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

/**
 * Get a single failed products by it's id
 * @param req
 * @param res
 */
export async function getFailedProductById(req: Request, res: Response) {
    try {
        await connect();
        const id = req.params.id;
        const result = await FailedProductModel.find({ _id: id });
        res.status(200).send(result);
    }
    catch (err) {
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