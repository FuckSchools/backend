import type { ISessionRepository } from '../domain/interface/repository.interface.js';
import { SessionHandler } from './sessionHandler.js';
import { type ResultAsync, ok, err } from 'neverthrow';

type SessionHandlerOutput = {
  owner: 'CODING_AGENT' | 'EXTERNAL_AGENT' | 'BACKGROUND_AGENT';
  projectId: string;
  id: string;
  threads: { goals: string; sessionId: string; id: string; messages: unknown[] }[];
}[];

export class GetSessionsByProjectId {
  constructor(protected repository: ISessionRepository) {}
  async execute(
    projectId: string,
  ): Promise<ResultAsync<SessionHandlerOutput, string>> {
    const sessionHandler = new SessionHandler(this.repository, projectId);
    const rehydrateResult = await sessionHandler.rehydrate();
    if (rehydrateResult.isErr()) {
      return err(rehydrateResult.error);
    }
    return ok(sessionHandler.output as unknown as SessionHandlerOutput);
  }
}
