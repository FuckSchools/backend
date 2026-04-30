export class BaseService<T, K> {
  private entity: T | undefined;
  private fullEntity: K | undefined;

  public get entityValue(): T {
    return this.entity as T;
  }

  public get fullEntityValue(): K {
    return this.fullEntity as K;
  }

  public setEntity(entity: T) {
    this.entity = entity;
  }

  public setFullEntity(fullEntity: K) {
    this.fullEntity = fullEntity;
  }
}
