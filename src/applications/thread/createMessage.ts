import { threadEntity } from '@/entities/thread.entity.js';
import { userEntity } from '@/entities/user.entity.js';
import { knownErrors } from '@/interfaces/error.interface.js';
import type { IThreadRepository } from '@/interfaces/repository/thread.interface.js';
import type { z } from 'zod';

export const createMessageUseCase =
  (ThreadRepository: IThreadRepository) =>
  async (
    threadId: z.infer<typeof threadEntity.shape.internal.shape.id>,
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
    sender: z.infer<
      typeof threadEntity.shape.external.shape.messages.element.shape.sender
    >,
    content: z.infer<
      typeof threadEntity.shape.external.shape.messages.element.shape.content
    >,
  ): Promise<z.infer<typeof threadEntity.shape.external.shape.messages>> => {
    try {
      const messages = await ThreadRepository.createMessage(
        await threadEntity.shape.internal.shape.id.parseAsync(threadId),
        await userEntity.shape.internal.shape.id.parseAsync(userId),
        await threadEntity.shape.external.shape.messages.element.shape.sender.parseAsync(
          sender,
        ),
        await threadEntity.shape.external.shape.messages.element.shape.content.parseAsync(
          content,
        ),
      );

      return messages;
    } catch (error) {
      if (knownErrors.some((KnownError) => error instanceof KnownError)) {
        console.error('🚀 ~ createMessageUseCase ~ error:', error);
      }

      throw error;
    }
  };
