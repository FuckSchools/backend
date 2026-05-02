import { sessionEntity } from '../domain/entity/session.entity.js';
import type { ISessionRepository } from '../domain/interface/session.interface.js';
import { SessionService } from '../domain/service/session.service.js';
import type { SessionFull } from '../domain/entity/session.entity.js';

export const createSession =
  (repository: ISessionRepository) =>
  async (projectId: string, ownerRaw: unknown): Promise<SessionFull> => {
    const params = sessionEntity.parse({ owner: ownerRaw });
    const service = new SessionService(repository, projectId);
    service.setEntity(params);
    const created = await service.createSession();
    if (!created) {
      throw new Error('Failed to create session');
    }
    const full = service.getFullEntity();
    if (!full) {
      throw new Error('Session not found after creation');
    }
    return full;
  };

export const getSessionsByProject =
  (repository: ISessionRepository) =>
  async (projectId: string): Promise<SessionFull[]> => {
    return repository.getSessionsByProjectId(projectId);
  };
