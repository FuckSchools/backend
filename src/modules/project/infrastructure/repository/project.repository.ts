import { prisma } from '@/config/prisma.js';
import type { IProjectRepository } from '../../domain/interface/project.interface.js';

export class ProjectRepository implements IProjectRepository {
  async update(
    id: string,
    params: Partial<{ title: string }>,
  ): Promise<
    { title: string } & {
      userId: string;
      id: string;
      createdAt: Date;
      updatedAt?: Date | undefined;
    }
  > {
    return await prisma.project.update({ where: { id }, data: params });
  }
  async create(
    params: { title: string },
    id?: string,
  ): Promise<
    { title: string } & {
      userId: string;
      id: string;
      createdAt: Date;
      updatedAt?: Date | undefined;
    }
  > {
    return await prisma.project.create({
      data: { ...params, user: { connect: { id: id! } } },
    });
  }
  async getById(id: string): Promise<
    | ({ title: string } & {
        userId: string;
        id: string;
        createdAt: Date;
        updatedAt?: Date | undefined;
      })
    | null
  > {
    return await prisma.project.findUnique({ where: { id } });
  }
  async getAll(id: string): Promise<
    ({ title: string } & {
      userId: string;
      id: string;
      createdAt: Date;
      updatedAt?: Date | undefined;
    })[]
  > {
    return await prisma.project.findMany({ where: { userId: id } });
  }
}
