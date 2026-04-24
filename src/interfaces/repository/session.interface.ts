import { sessionEntity } from '@/entities/session.entity.js';
import * as z from 'zod';

export interface ISessionRepository {
  createThread(
    id: z.infer<typeof sessionEntity.shape.internal.shape.id>,
  ): Promise<z.infer<typeof sessionEntity.shape.external.shape.threads>>;
}
