import type { RepositoryInjectionType } from '../../../DI/repository.js';
import express from 'express';
import { NodeController } from './node.controller.js';

export const nodeRouter = (repositoryInjection: RepositoryInjectionType) => {
  const router: express.Router = express.Router();
  const nodeController = new NodeController(repositoryInjection);

  router.get('/:projectId', nodeController.getTree);
  return router;
};
