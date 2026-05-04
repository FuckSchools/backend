import express from 'express';
import { CreateProject } from '../application/createProject.js';
import type { RepositoryInjectionType } from '../../../DI/repository.js';
import { getProjectById, getProjects } from '../application/getProject.js';

export class ProjectController {
  constructor(private repository: RepositoryInjectionType) {}

  public async createProject(req: express.Request, res: express.Response) {
    return await createProjectController(this.repository)(req, res);
  }

  public async getProjectById(req: express.Request, res: express.Response) {
    return await getProjectController(this.repository)(req, res);
  }

  public async getProjects(req: express.Request, res: express.Response) {
    return await getProjectsController(this.repository)(req, res);
  }
}

export const createProjectController =
  (repository: RepositoryInjectionType) =>
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = res.locals['userId'];
      const title = req.body['title'];

      const createProjectUseCase = new CreateProject(repository.userRepository);
      const createdProject = await createProjectUseCase.execute(userId, title);
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
        const getProjectByIdUseCase = new getProjectById(
          repository.userRepository,
        );
        const project = await getProjectByIdUseCase.execute(projectId, userId);
        res.status(200).json(project);
      } else {
        res.status(400).json({ message: 'Project ID is required' });
      }
    } catch (error) {
      console.error('🚀 ~ getProjectController ~ error:', error);

      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

const getProjectsController =
  (repository: RepositoryInjectionType) =>
  async (_req: express.Request, res: express.Response) => {
    const userId = res.locals['userId'];

    const getProjectsUseCase = new getProjects(repository.userRepository);
    const result = await getProjectsUseCase.execute(userId);
    result.match(
      (ok) => res.status(200).json(ok),
      (err) => res.status(500).json({ error: err }),
    );
  };
