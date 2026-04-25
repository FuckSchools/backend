import {
  threadEntity,
  type threadCreationEntity,
} from '@/entities/thread.entity.js';
import { userEntity } from '@/entities/user.entity.js';
import type { z } from 'zod';

export interface IThreadRepository {
  create(
    data: z.infer<typeof threadCreationEntity>,
  ): Promise<z.infer<typeof threadEntity.shape.internal>>;
  getById(
    threadId: z.infer<typeof threadEntity.shape.internal.shape.id>,
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
  ): Promise<z.infer<typeof threadEntity>>;
}
