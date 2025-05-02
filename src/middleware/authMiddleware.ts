import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../config';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: 'admin' | 'user';
    };
}

export function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const token = req.header('auth-token');

    if (!token) {
        res.status(401).json({ error: 'Access denied. No token provided.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, TOKEN_SECRET) as AuthenticatedRequest['user'];
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token.' });
    }
}

export function isAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ error: 'Access denied. Admins only.' });
        return;
    }
    next();
}