import type { RepositoryInjectionType } from '../../../DI/repository.js';
import {
  createProjectController,
  getProjectController,
} from './project.controller.js';
import express from 'express';

export const projectRouter = (repositoryInjection: RepositoryInjectionType) => {
  const router: express.Router = express.Router();

  router.post('/', createProjectController(repositoryInjection));
  router.get('/:projectId', getProjectController(repositoryInjection));
  router.get('/', getProjectController(repositoryInjection));
  return router;
};
