import { prisma } from '@/config/prisma.js';
import type { IProjectRepository } from '../../domain/interface/project.interface.js';
import type { ProjectFull } from '../../domain/entity/project.entity.js';
import {
  projectEntity,
  projectProviderEntity,
} from '../../domain/entity/project.entity.js';
import type { z } from 'zod';

export class ProjectRepository implements IProjectRepository {
  async createProject(
    userId: z.infer<typeof projectProviderEntity.shape.userId>,
    params: z.infer<typeof projectEntity>,
  ): Promise<ProjectFull> {
    return prisma.project.create({
      data: { ...params, user: { connect: { id: userId } } },
    });
  }

  async getUserProjectsByPage(
    userId: z.infer<typeof projectProviderEntity.shape.userId>,
    page: number,
    pageSize: number,
  ): Promise<Array<ProjectFull>> {
    return prisma.project.findMany({
      where: { userId },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }

  async findById(id: string): Promise<ProjectFull | null> {
    return prisma.project.findUnique({ where: { id } });
  }
}
