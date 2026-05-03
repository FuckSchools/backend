import { AggregateRoot } from '@/shared/domain/aggregate/aggregateRoot.js';
import { threadSchema } from '../schema/thread.schema.js';
import type z from 'zod';
import type { MessageEntity } from '../entity/message.entity.js';
import { ThreadEntity } from '../entity/thread.entity.js';

export class ThreadAggregate extends AggregateRoot<typeof threadSchema> {
  private _messageEntities: MessageEntity[] = [];
  constructor(threadEntity: ThreadEntity) {
    super(threadEntity);
  }

  public addMessage(messageEntity: MessageEntity): void {
    this._messageEntities.push(messageEntity);
  }

  public get messageEntities(): MessageEntity[] {
    return this._messageEntities;
  }

  public newThread(
    threadData: z.infer<typeof threadSchema>,
    id?: string,
  ): ThreadAggregate {
    return new ThreadAggregate(new ThreadEntity(threadData, id));
  }
}
