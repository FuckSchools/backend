import z from 'zod';
import { Entity } from '../entity/entity.js';

export class AggregateRoot<T extends z.ZodObject> extends Entity<T> {
  private _entity: Entity<T>;
  constructor(entity: Entity<T>) {
    super(entity.data, entity.schema, entity.id);
    this._entity = entity;
  }
  get entity(): Entity<T> {
    return this._entity;
  }
}
