import { AggregateRoot } from '@/shared/domain/aggregate/aggregateRoot.js';
import { sessionSchema } from '../schema/session.schema.js';
import type { SessionEntity } from '../entity/session.entity.js';
import { ThreadEntity } from '../entity/thread.entity.js';
import { ThreadAggregate } from './threadAggregate.js';
import { NotFoundError } from '@/shared/domain/interface/error.interface.js';

export class SessionAggregate extends AggregateRoot<typeof sessionSchema> {
  private _threadEntities: ThreadEntity[] = [];
  private _output: ReturnType<SessionEntity['toJSON']> & {
    threads: Array<ThreadAggregate['output']>;
  };
  constructor(sessionEntity: SessionEntity) {
    super(sessionEntity);
    this._output = { ...sessionEntity.toJSON(), threads: [] };
  }

  public get threadEntities(): ThreadEntity[] {
    return this._threadEntities;
  }

  public newThreadAggregate(threadEntity: ThreadEntity): ThreadAggregate {
    this._threadEntities.push(threadEntity);
    this._output.threads.push({ ...threadEntity.toJSON(), messages: [] });
    return new ThreadAggregate(threadEntity);
  }

  public releaseThreadAggregate(threadAggregate: ThreadAggregate): void {
    const updatingThreads = this._output.threads.filter(
      (t) => t.id !== threadAggregate.id,
    );
    if (updatingThreads.length + 1 !== this._output.threads.length) {
      throw new NotFoundError('Thread not found');
    }
    this._output.threads = this._output.threads.filter(
      (t) => t.id !== threadAggregate.id,
    );
    this._output.threads.push(threadAggregate.output);
  }

  public addThreadAggregate(threadAggregate: ThreadAggregate): void {
    this._threadEntities.push(threadAggregate.entity);
    this._output.threads.push(threadAggregate.output);
  }

  public get output() {
    return this._output;
  }
}
