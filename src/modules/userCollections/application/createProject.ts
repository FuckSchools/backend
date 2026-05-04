import { ProjectEntity } from '../domain/entity/project.entity.js';
import type { IUserRepository } from '../domain/interface/repository.interface.js';
import { okAsync, type ResultAsync } from 'neverthrow';

export class CreateProject {
  constructor(protected repository: IUserRepository) {}

  async execute(
    userId: string,
    title: string,
  ): Promise<
    ResultAsync<{ id: string; title: string; userId: string }, string>
  > {
    const projectEntity = new ProjectEntity({ title, userId });
    await this.repository.createProject(projectEntity, userId);
    return okAsync({ ...projectEntity.data, id: projectEntity.id });
  }
}
