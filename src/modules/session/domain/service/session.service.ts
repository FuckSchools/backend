import { SessionAggregate } from '../aggregate/sessionAggregate.js';
import { SessionEntity } from '../entity/session.entity.js';
import type { ISessionRepository } from '../interface/repository.interface.js';
export class SessionHandler extends SessionAggregate {
  private _isThreadLoaded: boolean = false;
  constructor(
    protected readonly repository: ISessionRepository,
    private readonly _projectId: string,
    sessionEntity: SessionEntity,
  ) {
    super(sessionEntity);
  }

  public get projectId(): string {
    return this._projectId;
  }
}

export class SessionHandlerBuilder {
  constructor(
    protected readonly repository: ISessionRepository,
    private readonly projectId: string,
  ) {}
  public async getSessionHandlersByProjectId(): Promise<SessionHandler[]> {
    const sessionEntities = await this.repository.getByProjectId(
      this.projectId,
    );
    const sessionHandlers: SessionHandler[] = [];
    for (const sessionEntity of sessionEntities) {
      sessionHandlers.push(
        this.getSessionHandlerBySessionEntity(sessionEntity),
      );
    }
    return sessionHandlers;
  }

  public async getSessionHandlerBySessionId(
    sessionId: string,
  ): Promise<SessionAggregate> {
    const sessionEntity = await this.repository.findById(sessionId);
    if (!sessionEntity) {
      throw new Error('Session not found.');
    }
    if (sessionEntity.projectId !== this.projectId) {
      throw new Error('Session does not belong to the project.');
    }
    return this.getSessionHandlerBySessionEntity(sessionEntity);
  }

  private getSessionHandlerBySessionEntity(
    sessionEntity: SessionEntity,
  ): SessionHandler {
    return new SessionHandler(this.repository, this.projectId, sessionEntity);
  }
}
