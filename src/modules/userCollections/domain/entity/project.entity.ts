import { Entity } from '@/shared/domain/entity/entity.js';
import z from 'zod';
import { projectSchema } from '../schema/project.schema.js';

export class ProjectEntity extends Entity<typeof projectSchema> {
  constructor(data: z.infer<typeof projectSchema>, id?: string) {
    super(data, projectSchema, id);
  }
}
