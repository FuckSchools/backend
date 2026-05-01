import type { IUserCollectionRepository } from '../domain/interface/project.interface.js';
import { UserCollectionService } from '../domain/service/user.service.js';

export const createProject =
  (UserCollectionRepository: IUserCollectionRepository) =>
  async (title: string, userId: string) => {
    const userCollectionService = new UserCollectionService(
      UserCollectionRepository,
      userId,
    );
    const projectService = await userCollectionService.createProject({ title });
    return projectService.getFullEntity();
  };
