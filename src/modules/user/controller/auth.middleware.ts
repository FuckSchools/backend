import express from 'express';
import { getAuth } from '@clerk/express';
import { validateUser } from '../application/validate.js';
import type { IUserRepository } from '../domain/interface/user.interface.js';

export const authMiddleware =
  (repository: IUserRepository) =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> => {
    const { isAuthenticated, userId } = getAuth(req);
    if (!isAuthenticated) {
      console.warn('Unauthorized access attempt');
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const id = await validateUser(repository)(userId);
    res.locals = { ...res.locals, userId: id };
    next();
  };
