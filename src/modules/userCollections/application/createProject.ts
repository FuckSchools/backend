import { ProjectEntity } from '../domain/entity/project.entity.js';
import type { IUserRepository } from '../domain/interface/repository.interface.js';

export class CreateProject {
  constructor(protected repository: IUserRepository) {}

  async execute(userId: string, title: string) {
    const projectEntity = new ProjectEntity({ title });
    await this.repository.createProject(projectEntity, userId);
    return { ...projectEntity.data, id: projectEntity.id };
  }
}
