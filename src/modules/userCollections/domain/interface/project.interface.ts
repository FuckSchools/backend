import type z from 'zod';
import type {
  ProjectFull,
  projectProviderEntity,
} from '../entity/project.entity.js';
import type { IUserRepository } from './user.interface.js';

export interface IProjectRepository {
  getProjectById(
    id: z.infer<typeof projectProviderEntity.shape.id>,
  ): Promise<ProjectFull | null>;
}

export interface IUserCollectionRepository
  extends IProjectRepository, IUserRepository {}
