import type { RepositoryInjectionType } from '../../../DI/repository.js';
import { ProjectController } from './project.controller.js';
import express from 'express';

export const projectRouter = (repositoryInjection: RepositoryInjectionType) => {
  const router: express.Router = express.Router();
  const projectController = new ProjectController(repositoryInjection);

  router.post('/', projectController.createProject);
  router.get('/:projectId', projectController.getProjectById);
  router.get('/', projectController.getProjects);
  return router;
};
