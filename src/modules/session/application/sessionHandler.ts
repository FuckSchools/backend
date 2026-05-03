import { SessionAggregate } from '../domain/aggregate/sessionAggregate.js';
import type { SessionEntity } from '../domain/entity/session.entity.js';
import { type ISessionRepository } from '../domain/interface/repository.interface.js';

export class SessionHandler {
  private _sessionAggregates: SessionAggregate[] = [];

  constructor(
    private readonly repository: ISessionRepository,
    protected projectId: string,
  ) {}

  public push(sessionEntity: SessionEntity): void {
    this._sessionAggregates.push(new SessionAggregate(sessionEntity));
  }

  public async rehydrate(): Promise<void> {
    const aggregates = await this.repository.getByProjectId(
      this.projectId,
      'Messages',
    );
    this._sessionAggregates = aggregates.map(
      (aggregate) => aggregate.sessionAggregate,
    );
  }

  public get output(): SessionAggregate['output'][] {
    return this._sessionAggregates.map(
      (sessionAggregate) => sessionAggregate.output,
    );
  }
}
