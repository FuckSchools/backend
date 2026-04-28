import { UserService } from '../domain/service/user.service.js';
import { UserRepository } from '../infrastructure/repository/user.repository.js';

export const validateUser = async (clerkId: string): Promise<string> => {
  const userService = new UserService(new UserRepository(), clerkId);
  const authorizedUser = await userService.validateWithClerkId();
  return authorizedUser.id;
};
