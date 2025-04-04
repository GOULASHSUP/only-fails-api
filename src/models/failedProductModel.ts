import { Schema, model } from 'mongoose';
import { FailedProduct } from '../interfaces/failedProducts';

const failedProductSchema = new Schema<FailedProduct>({
    name: { type: String, required: true, min: 20, max: 500 },
    startDate: { type: Date, required: true },
    failureDate: { type: Date, required: true },
    description: { type: String, required: true, min: 20, max: 500 },
    designedBy: { type: String, required: true, max: 50 },
    imageURL: { type: String, required: true },
    category: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    comments: [
        {
            userId: { type: String, required: true },
            text: { type: String, required: true },
            date: { type: Date, default: Date.now }
        }
    ],
    _createdBy:{ type:String, ref: 'User', required: true }
});

export const FailedProductModel = model<FailedProduct>('FailedProduct', failedProductSchema);