import {
  messageEntity,
  type messageCreationEntity,
} from '@/entities/message.entity.js';
import z from 'zod';

export interface IMessageRepository {
  create(
    data: z.infer<typeof messageCreationEntity>,
  ): Promise<z.infer<typeof messageEntity.shape.internal>>;
}
