import type { IUserRepository } from '../domain/interface/repository.interface.js';
import type { IUserAuth } from '../domain/interface/userAuth.interface.js';
import { ProjectService } from '../domain/service/user.service.js';

export class UserAuthorizedService implements IUserAuth {
  constructor(
    protected _isValidated: boolean = true,
    protected _userId: string,
  ) {}
  public get isValidated(): boolean {
    return this._isValidated;
  }
  public get userId(): string {
    return this._userId;
  }
}

const getProjectService = (
  userId: string,
  repository: IUserRepository,
): ProjectService => {
  const userService = new UserAuthorizedService(true, userId);
  return new ProjectService(userService, repository);
};

export class getProjectById {
  constructor(protected repository: IUserRepository) {}
  public async execute(projectId: string, userId: string) {
    const projectService = getProjectService(userId, this.repository);
    const projectEntity = await projectService.getProjectById(projectId);
    return { ...projectEntity.data, id: projectEntity.id };
  }
}

export class getProjects {
  constructor(protected repository: IUserRepository) {}
  public async execute(userId: string) {
    const projectService = getProjectService(userId, this.repository);
    const projectEntities = await projectService.getProjects();
    return projectEntities.map((project) => ({
      ...project.data,
      id: project.id,
    }));
  }
}
