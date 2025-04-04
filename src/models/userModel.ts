import { Schema, model } from 'mongoose';
import { User } from '../interfaces/user';

const userSchema = new Schema<User>({
    username: { type: String, required: true, min: 6, max: 25, unique: true },
    email: { type: String, required: true, min: 6, max: 50, unique: true },
    password: { type: String, required: true, min: 8, max: 100 },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    isBanned: { type: Boolean, default: false },
    votes: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'FailedProduct', required: true },
            voteType: { type: String, enum: ['up', 'down'], required: true }
        }
    ],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    registerDate: { type: Date, required: true, default: Date.now }
});

export const UserModel = model<User>('User', userSchema);