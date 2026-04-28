import type { Message, MessageProvider } from '../entity/message.entity.js';
import type { IRepository } from '@/modules/shared/domain/interface/repository.interface.js';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IMessageRepository extends IRepository<
  Message,
  MessageProvider
> {}
