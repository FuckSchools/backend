import type { IUserCollectionRepository } from '../domain/interface/project.interface.js';
import { UserCollectionService } from '../domain/service/user.service.js';

export const createProject =
  (UserCollectionRepository: IUserCollectionRepository) =>
  async (title: string, userId: string) => {
    const userCollectionService = new UserCollectionService(
      UserCollectionRepository,
      userId,
    );
    if (await userCollectionService.createProject({ title })) {
      return userCollectionService.getProjectServices().at(-1)?.getFullEntity();
    }
    throw new Error('Failed to create project');
  };
