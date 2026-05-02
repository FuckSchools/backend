import { prisma } from '@/config/prisma.js';
import type { IUserRepository } from '../../domain/interface/user.interface.js';
import type { UserFull } from '../../domain/entity/user.entity.js';

export class UserRepository implements IUserRepository {
  async createUser(clerkId: string): Promise<UserFull> {
    return prisma.user.create({ data: { clerkId } });
  }

  async validateUserByClerkId(clerkId: string): Promise<UserFull | null> {
    return prisma.user.findUnique({ where: { clerkId } });
  }
}
