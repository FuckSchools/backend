import type { IUserRepository } from '../domain/interface/repository.interface.js';
import { ResultAsync } from 'neverthrow';

export class getProjectById {
  constructor(protected repository: IUserRepository) {}
  public async execute(
    projectId: string,
    userId: string,
  ): Promise<
    ResultAsync<{ id: string; title: string; userId: string } | null, string>
  > {
    const result = await this.repository.getProjectById(projectId, userId);
    return result.map((project) =>
      // eslint-disable-next-line unicorn/no-null
      project ? { ...project.data, id: project.id } : null,
    );
  }
}

export class getProjects {
  constructor(protected repository: IUserRepository) {}
  public async execute(
    userId: string,
  ): Promise<
    ResultAsync<{ id: string; title: string; userId: string }[], string>
  > {
    const result = await this.repository.getProjectsByUserId(userId);
    return result.map((projects) =>
      projects.map((p) => ({ ...p.data, id: p.id })),
    );
  }
}
