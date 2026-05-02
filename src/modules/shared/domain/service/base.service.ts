import type { ProviderEntity } from '../entity/base.entity.js';

export class BaseService<T, K extends ProviderEntity> {
  private entity: T | undefined;
  private fullEntity: K | undefined;

  public getEntity(): T | undefined {
    return this.entity;
  }

  public getFullEntity(): K | undefined {
    return this.fullEntity;
  }

  public setEntity(entity?: T) {
    this.entity = entity;
  }

  public setFullEntity(fullEntity?: K) {
    this.fullEntity = fullEntity;
  }
}
