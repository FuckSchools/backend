import { SessionAggregate } from '../domain/aggregate/sessionAggregate.js';
import type { SessionEntity } from '../domain/entity/session.entity.js';
import { type ISessionRepository } from '../domain/interface/repository.interface.js';
import { type ResultAsync } from 'neverthrow';

export class SessionHandler {
  private _sessionAggregates: SessionAggregate[] = [];

  constructor(
    private readonly repository: ISessionRepository,
    protected projectId: string,
  ) {}

  public push(sessionEntity: SessionEntity): void {
    this._sessionAggregates.push(new SessionAggregate(sessionEntity));
  }

  public async rehydrate(): Promise<ResultAsync<void, string>> {
    const result = await this.repository.getByProjectId(this.projectId);
    return result.map((sessions) => {
      this._sessionAggregates = sessions.map((s) => s.sessionAggregate);
    });
  }

  public get output(): SessionAggregate['output'][] {
    return this._sessionAggregates.map(
      (sessionAggregate) => sessionAggregate.output,
    );
  }
}
