import type { Project, ProjectProvider } from '../entity/project.entity.js';
import type { IRepository } from '@/shared/domain/interface/repository.interface.js';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IProjectRepository extends IRepository<
  Project,
  ProjectProvider
> {}
