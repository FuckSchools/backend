import express from 'express';
import { verifyToken } from '@clerk/express';
import { validateUser } from '../application/validate.js';
import type { RepositoryInjectionType } from '../../../DI/repository.js';
import { logger } from '@/shared/infrastructure/logger.js';

export const authMiddleware =
  (repository: RepositoryInjectionType) =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) =>
  {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      logger.warn('No token provided');
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    try {
      const decodedToken = await verifyToken(token, {
        secretKey: process.env['CLERK_SECRET_KEY'],
      });
      const userId = decodedToken.sub;
      const id = await validateUser(repository.userRepository)(userId);
      res.locals = { ...res.locals, userId: id };
      next();
    } catch (error) {
      logger.error('Token verification failed', error);
      res.status(401).json({ error: 'Unauthorized' });
    }
  };
