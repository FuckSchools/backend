import type { RepositoryInjectionType } from '../../../DI/repository.js';
import express from 'express';
import { GetSessionsByProjectId } from '../application/getSessionsByProjectId.js';

export class SessionController {
  constructor(private readonly repositoryInjection: RepositoryInjectionType) {}

  public async getSessionsByProjectId(
    req: express.Request,
    res: express.Response,
  ) {
    try {
      const projectId = req.params['projectId'] as string;
      const getSessionsByProjectIdUseCase = new GetSessionsByProjectId(
        this.repositoryInjection.sessionRepository,
      );
      const sessions = await getSessionsByProjectIdUseCase.execute(projectId);
      res.status(200).json(sessions);
    } catch (error) {
      console.error('🚀 ~ getSessionsByProjectId ~ error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
