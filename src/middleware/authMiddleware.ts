import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config';

// Extended Express Request interface to include user data decoded from JWT
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: 'admin' | 'user';
    };
}

/**
 * Middleware to verify JWT token in 'auth-token' header
 * - Adds decoded user info to request object
 * - Returns 401 if token is missing or invalid
 */
export function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    // Get token from request header
    const token = req.header('auth-token');

    if (!token) {
        res.status(401).json({ error: 'Access denied. No token provided.' });
        return;
    }

    try {
        // Attempt to verify the token
        const decoded = jwt.verify(token, TOKEN_SECRET) as AuthenticatedRequest['user'];
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token.' });
    }
}

/**
 * Middleware to check if authenticated user has admin role
 * - Returns 403 if user is not an admin
 */
export function isAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ error: 'Access denied. Admins only.' });
        return;
    }
    next();
}