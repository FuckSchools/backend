import express from 'express';
import { nodeController } from './node.controller.js';
import type { RepositoryInjectionType } from '../../../DI/repository.js';

export const nodeRouter = (repositoryInjection: RepositoryInjectionType) => {
  const router: express.Router = express.Router();

  router.get('/:projectId', nodeController(repositoryInjection));
  return router;
};
