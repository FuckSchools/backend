import { ThreadAggregate } from '../aggregate/threadAggregate.js';
import type { ISessionRepository } from '../interface/repository.interface.js';
import type { ThreadEntity } from '../entity/thread.entity.js';

export class ThreadHandler extends ThreadAggregate {
  private _isMessageLoaded: boolean = false;
  constructor(
    protected readonly repository: ISessionRepository,
    threadEntity: ThreadEntity,
  ) {
    super(threadEntity);
  }

  public async loadMessages(): Promise<void> {
    if (this._isMessageLoaded) return;
    const messageEntities =
      await this.repository.getMessagesByThreadEntity(this);
    for (const messageEntity of messageEntities) {
      this.addMessage(messageEntity);
    }
    this._isMessageLoaded = true;
  }
}
