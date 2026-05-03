import type { ISessionRepository } from '../domain/interface/repository.interface.js';
import { SessionHandler } from './sessionHandler.js';

export class GetSessionsByProjectId {
  constructor(protected repository: ISessionRepository) {}
  async execute(projectId: string) {
    const sessionHandler = new SessionHandler(this.repository, projectId);
    await sessionHandler.rehydrate();
    return sessionHandler.output;
  }
}
