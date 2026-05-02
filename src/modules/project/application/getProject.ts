import type { IProjectRepository } from '../domain/interface/project.interface.js';
import { ProjectCollectionService } from '../domain/service/project.service.js';
import { z } from 'zod';

const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(10),
});

export const getProject =
  (repository: IProjectRepository) =>
  async (projectId: string, userId: string) => {
    const service = new ProjectCollectionService(repository, userId);
    const projectService = await service.acquireProjectById(projectId);
    return projectService.getFullEntity();
  };

export const getProjects =
  (repository: IProjectRepository) =>
  async (userId: string, page: unknown, pageSize: unknown) => {
    const pagination = paginationSchema.parse({ page, pageSize });
    const service = new ProjectCollectionService(repository, userId);
    return service.acquireProjectsByPage(pagination.page, pagination.pageSize);
  };
