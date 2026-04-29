import type { IUserRepository } from '../../domain/interface/user.interface.js';
import { prisma } from '@/config/prisma.js';

export class UserRepository implements IUserRepository {
  async update(
    id: string,
    params: Partial<{ clerkId: string }>,
  ): Promise<
    { clerkId: string } & {
      id: string;
      createdAt: Date;
      updatedAt?: Date | undefined;
    }
  > {
    return await prisma.user.update({ where: { id }, data: params });
  }
  async create(params: { clerkId: string }): Promise<
    { clerkId: string } & {
      id: string;
      createdAt: Date;
      updatedAt?: Date | undefined;
    }
  > {
    return await prisma.user.create({ data: { ...params } });
  }
  async getById(id: string): Promise<
    | ({ clerkId: string } & {
        id: string;
        createdAt: Date;
        updatedAt?: Date | undefined;
      })
    | null
  > {
    return await prisma.user.findUnique({ where: { clerkId: id } });
  }
  async getAll(id: string): Promise<
    ({ clerkId: string } & {
      id: string;
      createdAt: Date;
      updatedAt?: Date | undefined;
    })[]
  > {
    return await prisma.user.findMany({ where: { clerkId: id } });
  }
}
