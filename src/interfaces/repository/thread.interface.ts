import { threadEntity } from '@/entities/thread.entity.js';
import { userEntity } from '@/entities/user.entity.js';
import type { z } from 'zod';

export interface IThreadRepository {
  getById(
    threadId: z.infer<typeof threadEntity.shape.internal.shape.id>,
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
  ): Promise<z.infer<typeof threadEntity>>;

  createMessage(
    threadId: z.infer<typeof threadEntity.shape.internal.shape.id>,
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
    sender: z.infer<
      typeof threadEntity.shape.external.shape.messages.element.shape.sender
    >,
    content: z.infer<
      typeof threadEntity.shape.external.shape.messages.element.shape.content
    >,
  ): Promise<z.infer<typeof threadEntity.shape.external.shape.messages>>;
}
