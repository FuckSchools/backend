import express from 'express';
import { createProject } from '../application/createProject.js';
import { getProject, getProjects } from '../application/getProject.js';
import type { RepositoryInjectionType } from '../../../DI/repository.js';

export const createProjectController =
  (repository: RepositoryInjectionType) =>
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = res.locals['userId'];
      const title = req.body['title'];

      const createdProject = await createProject(
        repository.userCollectionRepository,
      )(title, userId);

      res.status(201).json(createdProject);
    } catch (error) {
      console.error('🚀 ~ createProjectController ~ error:', error);

      res.status(500).json({ message: 'Internal server error' });
    }
  };

export const getProjectController =
  (repository: RepositoryInjectionType) =>
  async (req: express.Request, res: express.Response) => {
    try {
      const projectId = req.params['projectId'] as string;
      const userId = res.locals['userId'];

      if (projectId) {
        const project = await getProject(repository.userCollectionRepository)(
          projectId,
          userId,
        );
        res.status(200).json(project);
      } else {
        const page = Number.parseInt(req.query['page'] as string) || 1;
        const pageSize = Number.parseInt(req.query['pageSize'] as string) || 10;
        const projects = await getProjects(repository.userCollectionRepository)(
          userId,
          page,
          pageSize,
        );
        res.status(200).json(projects);
      }
    } catch (error) {
      console.error('🚀 ~ getProjectController ~ error:', error);

      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
