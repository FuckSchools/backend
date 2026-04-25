import { messageEntity } from '@/entities/message.entity.js';
import { threadEntity } from '@/entities/thread.entity.js';
import type { IMessageRepository } from '@/interfaces/repository/message.interface.js';
import type { z } from 'zod';

export const createMessageUseCase =
  (MessageRepository: IMessageRepository) =>
  async (data: {
    threadId: z.infer<typeof threadEntity.shape.internal.shape.id>;
    role: z.infer<typeof messageEntity.shape.internal.shape.role>;
    content: z.infer<typeof messageEntity.shape.internal.shape.content>;
  }): Promise<z.infer<typeof messageEntity.shape.internal>> => {
    try {
      const message = await MessageRepository.create(data);

      return message;
    } catch (error) {
      console.error('🚀 ~ createMessageUseCase ~ error:', error);

      throw error;
    }
  };
