import type { RepositoryInjectionType } from '../../../DI/repository.js';
import { SessionController } from './session.controller.js';
import express from 'express';

export const sessionRoute = (repositoryInjection: RepositoryInjectionType) => {
  const router: express.Router = express.Router();
  const sessionController = new SessionController(repositoryInjection);

  router.get('/:projectId', sessionController.getSessionsByProjectId);
  return router;
};
