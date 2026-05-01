import z from 'zod';
import {
  userEntity,
  userProviderEntity,
  type UserFull,
} from '../entity/user.entity.js';
import { projectEntity, type ProjectFull } from '../entity/project.entity.js';

export interface IUserRepository {
  createUser(
    clerkId: z.infer<typeof userEntity.shape.clerkId>,
  ): Promise<UserFull>;
  validateUserByClerkId(
    clerkId: z.infer<typeof userEntity.shape.clerkId>,
  ): Promise<UserFull | null>;
  createProject(
    userId: z.infer<typeof userProviderEntity.shape.id>,
    params: z.infer<typeof projectEntity>,
  ): Promise<ProjectFull>;
  getUserProjectsByPage(
    userId: z.infer<typeof userProviderEntity.shape.id>,
    page: number,
    pageSize: number,
  ): Promise<Array<ProjectFull>>;
}
