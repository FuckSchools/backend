import type { ProjectEntity } from '../entity/project.entity.js';
import { UserEntity } from '../entity/user.entity.js';
import type { IUserRepository } from '../interface/repository.interface.js';
import type { IUserAuth } from '../interface/userAuth.interface.js';

export class UserAuthService implements IUserAuth {
  private _isValidated: boolean = false;
  constructor(
    protected userEntity: UserEntity,
    protected repository: IUserRepository,
  ) {}
  public async validateUser(): Promise<void> {
    const user = await this.repository.findById(this.userEntity.data.clerkId);
    if (user) {
      this.userEntity = user;
      this._isValidated = true;
    }
  }

  public get isValidated(): boolean {
    return this._isValidated;
  }

  public async registerUser(): Promise<void> {
    await this.repository.save(this.userEntity);
    this._isValidated = true;
  }

  public get userId(): string {
    return this.userEntity.id;
  }
}
export class ProjectService {
  constructor(
    private userAuthService: IUserAuth,
    private repository: IUserRepository,
  ) {
    if (!this.userAuthService.isValidated) {
      throw new Error('User is not validated');
    }
  }
  public async getProjectById(projectId: string): Promise<ProjectEntity> {
    const projectEntity = await this.repository.getProjectById(
      projectId,
      this.userAuthService.userId,
    );
    if (!projectEntity) {
      throw new Error('Project not found');
    }
    return projectEntity;
  }

  public async getProjects(): Promise<ProjectEntity[]> {
    return await this.repository.getProjectsByUserId(
      this.userAuthService.userId,
    );
  }
}
