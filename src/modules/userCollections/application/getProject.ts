import type { IUserCollectionRepository } from '../domain/interface/project.interface.js';
import { UserCollectionService } from '../domain/service/user.service.js';

export const getProject =
  (UserCollectionRepository: IUserCollectionRepository) =>
  async (projectId: string, userId: string) => {
    const userCollectionService = new UserCollectionService(
      UserCollectionRepository,
      userId,
    );
    const projectService =
      await userCollectionService.acquireProjectById(projectId);
    return projectService.getFullEntity();
  };

export const getProjects =
  (UserCollectionRepository: IUserCollectionRepository) =>
  async (userId: string, page: number, pageSize: number) => {
    const userCollectionService = new UserCollectionService(
      UserCollectionRepository,
      userId,
    );
    return await userCollectionService.acquireProjectsByPage(page, pageSize);
  };
