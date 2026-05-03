import z from 'zod';
import { Entity } from '../entity/entity.js';

export class AggregateRoot<T extends z.ZodType> extends Entity<T> {
  constructor(protected entity: Entity<T>) {
    super(entity.data, entity.schema, entity.id);
  }
}
