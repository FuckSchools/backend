import type { IUserRepository } from '../domain/interface/user.interface.js';

export const validateUser =
  (repository: IUserRepository) =>
  async (clerkId: string): Promise<string> => {
    const existingUser = await repository.validateUserByClerkId(clerkId);
    if (!existingUser) {
      const newUser = await repository.createUser(clerkId);
      return newUser.id;
    }
    return existingUser.id;
  };
