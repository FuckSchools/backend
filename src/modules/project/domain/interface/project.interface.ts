import type z from 'zod';
import type { ProjectFull } from '../entity/project.entity.js';
import type {
  projectEntity,
  projectProviderEntity,
} from '../entity/project.entity.js';
import type { IRepository } from '@/shared/domain/interface/repository.interface.js';

export interface IProjectRepository extends IRepository<ProjectFull> {
  createProject(
    userId: z.infer<typeof projectProviderEntity.shape.userId>,
    params: z.infer<typeof projectEntity>,
  ): Promise<ProjectFull>;
  getUserProjectsByPage(
    userId: z.infer<typeof projectProviderEntity.shape.userId>,
    page: number,
    pageSize: number,
  ): Promise<Array<ProjectFull>>;
}
