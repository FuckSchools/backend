import { NotFoundError } from '@/shared/domain/interface/error.interface.js';
import type { IUserRepository } from '@/userCollections/domain/interface/repository.interface.js';

export class ValidateProjectId {
  constructor(private readonly repository: IUserRepository) {}
  public async execute(projectId: string, userId: string) {
    const project = await this.repository.getProjectById(projectId, userId);
    if (!project) {
      throw new NotFoundError('Project not found');
    }
  }
}
