import type { Entity } from '../entity/entity.js';
import { type ResultAsync } from 'neverthrow';

export interface IRepository<TEntity extends Entity> {
  save(data: TEntity): Promise<ResultAsync<void, string>>;
  getById(id: string): Promise<ResultAsync<TEntity | null, string>>;
}
