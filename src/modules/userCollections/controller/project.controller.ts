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
    const userId = res.locals['userId'];
    const title = req.body['title'];

    const createProjectUseCase = new CreateProject(repository.userRepository);
    const result = await createProjectUseCase.execute(userId, title);

    return result.match(
      (ok) => res.status(201).json(ok),
      (err) => res.status(500).json({ error: String(err) }),
    );
  };

export const getProjectController =
  (repository: RepositoryInjectionType) =>
  async (req: express.Request, res: express.Response) => {
    const projectId = req.params['projectId'] as string;
    const userId = res.locals['userId'];

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    const getProjectByIdUseCase = new getProjectById(repository.userRepository);
    const result = await getProjectByIdUseCase.execute(projectId, userId);

    return result.match(
      (ok) => {
        if (!ok) {
          return res.status(404).json({ error: 'Project not found' });
        }
        return res.status(200).json(ok);
      },
      (err) => res.status(500).json({ error: String(err) }),
    );
  };

const getProjectsController =
  (repository: RepositoryInjectionType) =>
  async (_req: express.Request, res: express.Response) => {
    const userId = res.locals['userId'];

    const getProjectsUseCase = new getProjects(repository.userRepository);
    const result = await getProjectsUseCase.execute(userId);

    return result.match(
      (ok) => res.status(200).json(ok),
      (err) => res.status(500).json({ error: String(err) }),
    );
  };
