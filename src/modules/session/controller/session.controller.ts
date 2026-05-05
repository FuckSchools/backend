import type { GetSessionsByProjectId } from '../application/getSessionsByProjectId.js';
import express from 'express';

export class SessionController {
  constructor(
    private readonly getSessionsByProjectIdUseCase: GetSessionsByProjectId,
  ) {}

  public getSessionsByProjectId = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const projectId = req.params['projectId'] as string;
      const sessions = await this.getSessionsByProjectIdUseCase.execute(projectId);
      res.status(200).json(sessions);
    } catch (error) {
      next(error);
    }
  };
}
