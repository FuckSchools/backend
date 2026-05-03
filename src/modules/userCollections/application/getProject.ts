import type { IUserRepository } from '../domain/interface/repository.interface.js';

export class getProjectById {
  constructor(protected repository: IUserRepository) {}
  public async execute(projectId: string, userId: string) {
    return await this.repository.getProjectById(projectId, userId);
  }
}

export class getProjects {
  constructor(protected repository: IUserRepository) {}
  public async execute(userId: string) {
    return await this.repository.getProjectsByUserId(userId);
  }
}
