import type { RepositoryInjectionType } from '../../../DI/repository.js';
import { PrintTree } from '../application/printTree.js';
import { projectAuthMiddleware } from '@/session/controller/projectAuth.middleware.js';
import { ValidateProjectId } from '@/session/application/validate.js';
import express from 'express';
import { NodeController } from './node.controller.js';

export const nodeRouter = (repositoryInjection: RepositoryInjectionType) => {
  const router: express.Router = express.Router();
  const printTreeUseCase = new PrintTree(repositoryInjection.rootNodeRepository);
  const validateProjectIdUseCase = new ValidateProjectId(
    repositoryInjection.userRepository,
  );
  const nodeController = new NodeController(printTreeUseCase);

  router.get(
    '/:projectId',
    projectAuthMiddleware(validateProjectIdUseCase),
    nodeController.getTree,
  );
  return router;
};
