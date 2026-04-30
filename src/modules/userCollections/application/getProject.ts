import type { IUserCollectionRepository } from '../domain/interface/project.interface.js';
import { UserCollectionService } from '../domain/service/user.service.js';

export const getProject =
  (UserCollectionRepository: IUserCollectionRepository) =>
  async (projectId: string, userId: string) => {
    const userCollectionService = new UserCollectionService(
      UserCollectionRepository,
      userId,
    );
    return await userCollectionService.acquireProjectById(projectId);
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
