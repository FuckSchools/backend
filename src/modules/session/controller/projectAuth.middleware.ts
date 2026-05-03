import type { RepositoryInjectionType } from '../../../DI/repository.js';
import express from 'express';
import { ValidateProjectId } from '../application/validate.js';

export const projectAuthMiddleware =
  (repositoryInjection: RepositoryInjectionType) =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const userId = res.locals['userId'];
    const projectId = req.params['projectId'] as string;

    if (!userId) {
      console.warn(
        'Unauthorized access attempt: No user ID found in response locals',
      );
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!projectId) {
      console.warn('Bad request: No project ID found in request parameters');
      res.status(400).json({ error: 'Project ID is required' });
      return;
    }
    try {
      const validateProjectAccessUseCase = new ValidateProjectId(
        repositoryInjection.userRepository,
      );
      await validateProjectAccessUseCase.execute(projectId, userId);
      next();
    } catch (error) {
      console.error('🚀 ~ projectAuthMiddleware ~ error:', error);
      res
        .status(403)
        .json({ error: 'Forbidden: You do not have access to this project' });
    }
  };
