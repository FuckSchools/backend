import { ProjectEntity } from '../entity/project.entity.js';
import { UserEntity } from '../entity/user.entity.js';

export class UserAuthService extends UserEntity {
  private _isValidated: boolean = false;
  constructor(protected userEntity: UserEntity) {
    super(userEntity.data, userEntity.id);
  }
  public validateUser(userEntity: UserEntity): void {
    this.userEntity = userEntity;
    this._isValidated = true;
  }

  public get isValidated(): boolean {
    return this._isValidated;
  }

  public get userId(): string {
    return this.userEntity.id;
  }
}
export class ProjectService extends ProjectEntity {
  constructor(projectEntity: ProjectEntity) {
    super(projectEntity.data, projectEntity.id);
  }

  public get userId(): string {
    return this.data.userId;
  }
}
