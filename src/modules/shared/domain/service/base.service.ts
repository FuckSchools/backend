import { Entity } from '../entity/entity.js';

export class AggregateRoot<T extends Entity = Entity> {
  constructor(protected rootEntity: T) {}
}
