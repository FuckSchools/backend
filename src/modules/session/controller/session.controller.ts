import type { RepositoryInjectionType } from '../../../DI/repository.js';
import express from 'express';
import { GetSessionsByProjectId } from '../application/getSessionsByProjectId.js';

export class SessionController {
  constructor(private readonly repositoryInjection: RepositoryInjectionType) {}

  public async getSessionsByProjectId(
    req: express.Request,
    res: express.Response,
  ) {
    const projectId = req.params['projectId'] as string;
    const getSessionsByProjectIdUseCase = new GetSessionsByProjectId(
      this.repositoryInjection.sessionRepository,
    );
    const result = await getSessionsByProjectIdUseCase.execute(projectId);

    return result.match(
      (ok) => res.status(200).json(ok),
      (err) => res.status(500).json({ error: String(err) }),
    );
  }
}
