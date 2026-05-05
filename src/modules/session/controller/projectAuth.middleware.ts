import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '@/shared/domain/interface/error.interface.js';
import { ValidateProjectId } from '../application/validate.js';

export const projectAuthMiddleware =
  (validateProjectAccessUseCase: ValidateProjectId) =>
  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const userId = res.locals['userId'];
    const projectId = req.params['projectId'] as string;

    if (!userId) {
      return next(new UnauthorizedError());
    }

    if (!projectId) {
      res.status(400).json({ error: 'Project ID is required' });
      return;
    }

    try {
      await validateProjectAccessUseCase.execute(projectId, userId);
      next();
    } catch (error) {
      next(error);
    }
  };
