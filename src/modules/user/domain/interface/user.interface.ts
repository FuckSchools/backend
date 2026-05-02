import type { UserFull } from '../entity/user.entity.js';

export interface IUserRepository {
  createUser(clerkId: string): Promise<UserFull>;
  validateUserByClerkId(clerkId: string): Promise<UserFull | null>;
}
