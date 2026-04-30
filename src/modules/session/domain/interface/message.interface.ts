import type { Message, MessageFull } from '../entity/message.entity.js';

export interface IMessageRepository {
  createMessage(threadId: string, params: Message): Promise<MessageFull>;
  getMessagesByThreadId(threadId: string): Promise<Array<MessageFull>>;
  getMessageById(messageId: string): Promise<MessageFull | null>;
}
