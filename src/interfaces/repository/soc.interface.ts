import * as z from 'zod';
import {
  stateOfCompletionEntity,
  type socCreationEntity,
} from '@/entities/soc.entity.js';

export interface IStateOfCompletionRepository {
  create(
    data: z.infer<typeof socCreationEntity>,
  ): Promise<z.infer<typeof stateOfCompletionEntity.shape.internal>>;
}
