import { prisma } from '@/config/prisma.js';
import type {
  messageCreationEntity,
  messageEntity,
} from '@/entities/message.entity.js';
import { CustomError } from '@/interfaces/error.interface.js';
import type { IMessageRepository } from '@/interfaces/repository/message.interface.js';
import type { output } from 'zod';

export class MessageRepository implements IMessageRepository {
  async create(
    data: output<typeof messageCreationEntity>,
  ): Promise<output<typeof messageEntity.shape.internal>> {
    try {
      return await prisma.message.create({ data });
    } catch (error) {
      console.error('🚀 ~ MessageRepository ~ create ~ error:', error);
      throw new CustomError(
        'Failed to create message.',
        'IllegalOperationError',
      );
    }
  }
}
