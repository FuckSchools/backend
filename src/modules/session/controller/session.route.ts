import type { RepositoryInjectionType } from '../../../DI/repository.js';
import { GetSessionsByProjectId } from '../application/getSessionsByProjectId.js';
import { ValidateProjectId } from '../application/validate.js';
import { projectAuthMiddleware } from './projectAuth.middleware.js';
import { SessionController } from './session.controller.js';
import express from 'express';

export const sessionRoute = (repositoryInjection: RepositoryInjectionType) => {
  const router: express.Router = express.Router();
  const getSessionsByProjectIdUseCase = new GetSessionsByProjectId(
    repositoryInjection.sessionRepository,
  );
  const validateProjectIdUseCase = new ValidateProjectId(
    repositoryInjection.userRepository,
  );
  const sessionController = new SessionController(getSessionsByProjectIdUseCase);

  router.get(
    '/:projectId',
    projectAuthMiddleware(validateProjectIdUseCase),
    sessionController.getSessionsByProjectId,
  );
  return router;
};
