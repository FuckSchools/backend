import type { IRepository } from '@/shared/domain/interface/repository.interface.js';
import type { UserEntity } from '../entity/user.entity.js';
import type { ProjectEntity } from '../entity/project.entity.js';
import type { ResultAsync } from 'neverthrow';

export interface IUserRepository extends IRepository<UserEntity> {
  getProjectsByUserId(
    userId: string,
  ): Promise<ResultAsync<ProjectEntity[], string>>;
  getProjectById(
    projectId: string,
    userId: string,
  ): Promise<ProjectEntity | null>;
  createProject(project: ProjectEntity, userId: string): Promise<void>;
}
