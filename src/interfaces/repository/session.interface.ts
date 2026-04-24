import { projectEntity } from '@/entities/project.entity.js';
import { sessionEntity } from '@/entities/session.entity.js';
import { userEntity } from '@/entities/user.entity.js';
import type { z } from 'zod';

export interface ISessionRepository {
  create(
    projectId: z.infer<typeof projectEntity.shape.internal.shape.id>,
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
    owner: z.infer<typeof sessionEntity.shape.internal.shape.owner>,
  ): Promise<z.infer<typeof sessionEntity>>;

  getById(
    sessionId: z.infer<typeof sessionEntity.shape.internal.shape.id>,
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
  ): Promise<z.infer<typeof sessionEntity>>;

  createThread(
    sessionId: z.infer<typeof sessionEntity.shape.internal.shape.id>,
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
  ): Promise<z.infer<typeof sessionEntity.shape.external.shape.threads>>;
}
