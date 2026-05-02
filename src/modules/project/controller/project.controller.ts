import express from 'express';
import { createProject } from '../application/createProject.js';
import { getProject, getProjects } from '../application/getProject.js';
import type { IProjectRepository } from '../domain/interface/project.interface.js';

export const createProjectController =
  (repository: IProjectRepository) =>
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = res.locals['userId'] as string;
      const title: unknown = req.body['title'];

      const createdProject = await createProject(repository)(title, userId);
      res.status(201).json(createdProject);
    } catch (error) {
      console.error('createProjectController error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

export const getProjectByIdController =
  (repository: IProjectRepository) =>
  async (req: express.Request, res: express.Response) => {
    try {
      const projectId = req.params['projectId'] as string;
      const userId = res.locals['userId'] as string;

      const project = await getProject(repository)(projectId, userId);
      res.status(200).json(project);
    } catch (error) {
      console.error('getProjectByIdController error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

export const getProjectsController =
  (repository: IProjectRepository) =>
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = res.locals['userId'] as string;
      const page = Number.parseInt(req.query['page'] as string) || 1;
      const pageSize = Number.parseInt(req.query['pageSize'] as string) || 10;

      const projects = await getProjects(repository)(userId, page, pageSize);
      res.status(200).json(projects);
    } catch (error) {
      console.error('getProjectsController error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
