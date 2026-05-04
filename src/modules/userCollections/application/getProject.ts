import type { IUserRepository } from '../domain/interface/repository.interface.js';
import { ResultAsync } from 'neverthrow';

export class getProjectById {
  constructor(protected repository: IUserRepository) {}
  public async execute(
    projectId: string,
    userId: string,
  ): Promise<ResultAsync<{ id: string; title: string; userId: string } | null, string>> {
    const result = await this.repository.getProjectById(projectId, userId);
    return result.map((project) => (project ? { ...project.data, id: project.id } : null)); // eslint-disable-line unicorn/no-null
  }
}

export class getProjects {
  constructor(protected repository: IUserRepository) {}
  public async execute(
    userId: string,
  ): Promise<ResultAsync<{ id: string; title: string; userId: string }[], string>> {
    const result = await this.repository.getProjectsByUserId(userId);
    return result.map((projects) => projects.map((p) => ({ ...p.data, id: p.id })));
  }
}
