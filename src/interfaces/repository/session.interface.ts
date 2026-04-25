import {
  sessionEntity,
  type sessionCreationEntity,
} from '@/entities/session.entity.js';
import type { z } from 'zod';

export interface ISessionRepository {
  create(
    data: z.infer<typeof sessionCreationEntity>,
  ): Promise<z.infer<typeof sessionEntity.shape.internal>>;

  getById(
    sessionId: z.infer<typeof sessionEntity.shape.internal.shape.id>,
  ): Promise<z.infer<typeof sessionEntity>>;
}
