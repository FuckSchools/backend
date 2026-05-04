import type { IUserRepository } from '@/userCollections/domain/interface/repository.interface.js';
import { err, ok, type Result } from 'neverthrow';

export class ValidateProjectId {
  constructor(private readonly repository: IUserRepository) {}
  public async execute(
    projectId: string,
    userId: string,
  ): Promise<Result<void, string>> {
    const project = await this.repository.getProjectById(projectId, userId);
    if (!project) {
      return err('Project not found');
    }
    return ok(undefined as void);
  }
}
