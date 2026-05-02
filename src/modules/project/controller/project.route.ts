import express from 'express';
import {
  createProjectController,
  getProjectByIdController,
  getProjectsController,
} from './project.controller.js';
import type { IProjectRepository } from '../domain/interface/project.interface.js';

export const projectRouter = (repository: IProjectRepository) => {
  const router: express.Router = express.Router();

  router.post('/', createProjectController(repository));
  router.get('/:projectId', getProjectByIdController(repository));
  router.get('/', getProjectsController(repository));
  return router;
};
