import { prisma } from '@/config/prisma.js';
import type { ISessionRepository } from '../../domain/interface/session.interface.js';

export class SessionRepository implements ISessionRepository {
  async create(
    params: { owner: 'CODING_AGENT' | 'EXTERNAL_AGENT' | 'BACKGROUND_AGENT' },
    id?: string,
  ): Promise<
    { owner: 'CODING_AGENT' | 'EXTERNAL_AGENT' | 'BACKGROUND_AGENT' } & {
      projectId: string;
      id: string;
      createdAt: Date;
      updatedAt?: Date | undefined;
    }
  > {
    return await prisma.session.create({
      data: { ...params, project: { connect: { id: id! } } },
    });
  }
  async getById(id: string): Promise<
    | ({ owner: 'CODING_AGENT' | 'EXTERNAL_AGENT' | 'BACKGROUND_AGENT' } & {
        projectId: string;
        id: string;
        createdAt: Date;
        updatedAt?: Date | undefined;
      })
    | null
  > {
    return await prisma.session.findUnique({ where: { id } });
  }
  async getAll(id: string): Promise<
    ({ owner: 'CODING_AGENT' | 'EXTERNAL_AGENT' | 'BACKGROUND_AGENT' } & {
      projectId: string;
      id: string;
      createdAt: Date;
      updatedAt?: Date | undefined;
    })[]
  > {
    return await prisma.session.findMany({ where: { projectId: id } });
  }
}
