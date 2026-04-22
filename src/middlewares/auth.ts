import express from 'express';
import { getAuth } from '@clerk/express';
import { CustomError } from '@/interfaces/error.js';

export const authMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): Promise<void> => {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated) {
    console.warn('Unauthorized access attempt');
    res.status(401).json({ error: 'Unauthorized' });
    throw new CustomError('Unauthorized access attempt', 'MiddlewareError');
  }
  req.body.userId = userId;
  next();
};
