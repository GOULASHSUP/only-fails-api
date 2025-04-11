import { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Joi from 'joi';

import { UserModel } from '../models/userModel';
import { connect, disconnect } from '../repository/database';

import { TOKEN_SECRET } from '../config';

/**
 * Login an admin user (no registration allowed)
 */
export const loginAdmin = async (req: Request, res: Response): Promise<Response | void> => {
    try {
    const { error } = validateAdminLogin(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    await connect();

    const admin = await UserModel.findOne({
    email: req.body.email.toLowerCase(),
    role: 'admin'
    });

    if (!admin) return res.status(400).json({ error: 'Invalid admin credentials.' });
    if (admin.isBanned) return res.status(403).json({ error: 'Admin is banned.' });

    const isValid = await bcrypt.compare(req.body.password, admin.password);
    if (!isValid) return res.status(400).json({ error: 'Invalid admin credentials.' });

    const token = jwt.sign(
    { id: admin._id, role: admin.role },
    TOKEN_SECRET,
    { expiresIn: '2h' }
    );

    return res.header('auth-token', token).json({
    token,
    adminId: admin._id,
    role: admin.role
    });

} catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: 'Error logging in admin.' });
    } finally {
        await disconnect();
    }
};

/**
 * Joi validation for admin login
 */
function validateAdminLogin(data: any) {
    return Joi.object({
        email: Joi.string().email().min(6).max(50).required(),
        password: Joi.string().min(8).max(100).required()
    }).validate(data);
}