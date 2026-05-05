import type { RepositoryInjectionType } from '../../../DI/repository.js';
import { GetSessionsByProjectId } from '../application/getSessionsByProjectId.js';
import { projectAuthMiddleware } from './projectAuth.middleware.js';
import { SessionController } from './session.controller.js';
import express from 'express';

export const sessionRoute = (repositoryInjection: RepositoryInjectionType) => {
  const router: express.Router = express.Router();
  const sessionController = new SessionController(repositoryInjection);

  router.get(
    '/:projectId',
    projectAuthMiddleware(repositoryInjection),
    sessionController.getSessionsByProjectId,
  );
  return router;
};
