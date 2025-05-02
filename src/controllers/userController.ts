import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Joi from 'joi';

import { UserModel } from '../models/userModel';
import { connect, disconnect } from '../repository/database';
import { TOKEN_SECRET } from '../config';

/**
 * Register a regular user
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { error } = validateUserRegistration(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return; // Ensure no further processing after a response is sent
        }

        await connect();

        const existingUser = await UserModel.findOne({ email: req.body.email.toLowerCase() });
        if (existingUser) {
            res.status(400).json({ error: 'Email already registered.' });
            return;
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new UserModel({
            username: req.body.username.toLowerCase(),
            email: req.body.email.toLowerCase(),
            password: hashedPassword,
            role: 'user',
            isBanned: false,
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: 'User registered successfully', userId: savedUser._id });

    } catch (err) {
        console.error("User registration error:", err);
        res.status(500).json({ error: 'Error registering user.' });
    } finally {
        await disconnect();
    }
};

/**
 * Login a regular user
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { error } = validateUserLogin(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }

        await connect();

        const user = await UserModel.findOne({ email: req.body.email.toLowerCase() });
        if (!user || user.role !== 'user') {
            res.status(400).json({ error: 'Invalid login credentials.' });
            return;
        }

        if (user.isBanned) {
            res.status(403).json({ error: 'User is banned.' });
            return;
        }

        const isValid = await bcrypt.compare(req.body.password, user.password);
        if (!isValid) {
            res.status(400).json({ error: 'Invalid login credentials.' });
            return;
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.TOKEN_SECRET as string,
            { expiresIn: '2h' }
        );

        res.header('auth-token', token).json({
            token,
            userId: user._id,
            role: user.role
        });

    } catch (err) {
        console.error("User login error:", err);
        res.status(500).json({ error: 'Error logging in user.' });
    } finally {
        await disconnect();
    }
};

/**
 * Joi validation for registration
 */
function validateUserRegistration(data: any) {
    return Joi.object({
        username: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().min(6).max(50).required(),
        password: Joi.string().min(8).max(100).required()
    }).validate(data);
}

/**
 * Joi validation for login
 */
function validateUserLogin(data: any) {
    return Joi.object({
        email: Joi.string().email().min(6).max(50).required(),
        password: Joi.string().min(8).max(100).required()
    }).validate(data);
}