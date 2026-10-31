import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function comparePassword(password: string, hash: string) {
  return hashPassword(password) === hash;
}

export function signToken(payload: Record<string, unknown>) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as {
    userId: string;
    role: string;
    email: string;
    name?: string;
  };
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);
    (req as Request & { user?: typeof decoded }).user = decoded;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  return requireAuth(req, res, () => {
    const user = (req as Request & { user?: { role?: string } }).user;
    if (user?.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: admin role required' });
    }
    return next();
  });
}
