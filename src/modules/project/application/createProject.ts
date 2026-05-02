import { projectEntity } from '../domain/entity/project.entity.js';
import type { IProjectRepository } from '../domain/interface/project.interface.js';
import { ProjectCollectionService } from '../domain/service/project.service.js';

export const createProject =
  (repository: IProjectRepository) =>
  async (title: unknown, userId: string) => {
    const params = projectEntity.parse({ title });
    const service = new ProjectCollectionService(repository, userId);
    const projectService = await service.createProject(params);
    return projectService.getFullEntity();
  };
