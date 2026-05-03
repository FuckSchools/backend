import { AggregateRoot } from '@/shared/domain/aggregate/aggregateRoot.js';
import { sessionSchema } from '../schema/session.schema.js';
import type { ThreadAggregate } from './threadAggregate.js';
import type { SessionEntity } from '../entity/session.entity.js';

export class SessionAggregate extends AggregateRoot<typeof sessionSchema> {
  private _threadAggregates: ThreadAggregate[] = [];
  constructor(sessionEntity: SessionEntity) {
    super(sessionEntity);
  }

  public get threadAggregates(): ThreadAggregate[] {
    return this._threadAggregates;
  }
}
