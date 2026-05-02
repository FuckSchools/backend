import type { Entity } from '../entity/entity.js';

export interface IRepository<TEntity extends Entity> {
  save(data: TEntity): Promise<void>;
  findById(id: string): Promise<TEntity | null>;
}
