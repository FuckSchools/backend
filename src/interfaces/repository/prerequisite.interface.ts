import * as z from 'zod';
import {
  prerequisiteEntity,
  type prerequisiteCreationEntity,
} from '@/entities/prerequisite.entity.js';

export interface IPrerequisiteRepository {
  create(
    data: z.infer<typeof prerequisiteCreationEntity>,
  ): Promise<z.infer<typeof prerequisiteEntity.shape.internal>>;
}
