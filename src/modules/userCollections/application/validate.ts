import type { IUserCollectionRepository } from '../domain/interface/project.interface.js';

export const validateUser =
  (UserCollectionRepository: IUserCollectionRepository) =>
  async (clerkId: string): Promise<string> => {
    const existingUser =
      await UserCollectionRepository.validateUserByClerkId(clerkId);
    if (!existingUser) {
      const newUser = await UserCollectionRepository.createUser(clerkId);
      return newUser.id;
    }
    return existingUser.id;
  };
