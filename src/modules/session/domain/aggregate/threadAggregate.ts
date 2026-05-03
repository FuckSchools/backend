import { AggregateRoot } from '@/shared/domain/aggregate/aggregateRoot.js';
import { threadSchema } from '../schema/thread.schema.js';
import type { MessageEntity } from '../entity/message.entity.js';
import { ThreadEntity } from '../entity/thread.entity.js';

export class ThreadAggregate extends AggregateRoot<typeof threadSchema> {
  private _messageEntities: MessageEntity[] = [];
  private _output: ReturnType<ThreadEntity['toJSON']> & {
    messages: Array<ReturnType<MessageEntity['toJSON']>>;
  };
  constructor(threadEntity: ThreadEntity) {
    super(threadEntity);
    this._output = { ...threadEntity.toJSON(), messages: [] };
  }

  public addMessageEntity(messageEntity: MessageEntity): void {
    this._messageEntities.push(messageEntity);
    this._output.messages.push(messageEntity.toJSON());
  }

  public get messageEntities(): MessageEntity[] {
    return this._messageEntities;
  }

  public get output() {
    return this._output;
  }
}
