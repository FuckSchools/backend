import { type UserFull } from '@/userCollections/domain/entity/user.entity.js';
import {
  projectEntity,
  type ProjectFull,
} from '@/userCollections/domain/entity/project.entity.js';
import type { IUserCollectionRepository } from '@/userCollections/domain/interface/project.interface.js';
import { type output, ZodString, ZodUUID } from 'zod';
import { prisma } from '@/config/prisma.js';

export class UserCollectionRepository implements IUserCollectionRepository {
  async createUser(clerkId: output<ZodString>): Promise<UserFull> {
    return await prisma.user.create({ data: { clerkId } });
  }
  async validateUserByClerkId(
    clerkId: output<ZodString>,
  ): Promise<UserFull | null> {
    return await prisma.user.findUnique({ where: { clerkId } });
  }
  async createProject(
    userId: output<ZodUUID>,
    params: output<typeof projectEntity>,
  ): Promise<ProjectFull> {
    return await prisma.project.create({
      data: { ...params, user: { connect: { id: userId } } },
    });
  }
  async getUserProjectsByPage(
    userId: output<ZodUUID>,
    page: number,
    pageSize: number,
  ): Promise<Array<ProjectFull>> {
    return await prisma.project.findMany({
      where: { userId },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }
  async getProjectById(id: output<ZodUUID>): Promise<ProjectFull | null> {
    return await prisma.project.findUnique({ where: { id } });
  }
}
