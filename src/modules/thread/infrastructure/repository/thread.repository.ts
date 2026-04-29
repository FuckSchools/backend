import { prisma } from '@/config/prisma.js';
import type { IThreadRepository } from '../../domain/interface/thread.interface.js';

export class ThreadRepository implements IThreadRepository {
  async update(
    id: string,
    params: Partial<{ goals: string }>,
  ): Promise<
    { goals: string } & {
      sessionId: string;
      id: string;
      createdAt: Date;
      updatedAt?: Date | undefined;
    }
  > {
    return await prisma.thread.update({ where: { id }, data: params });
  }
  async create(
    params: { goals: string },
    id?: string,
  ): Promise<
    { goals: string } & {
      sessionId: string;
      id: string;
      createdAt: Date;
      updatedAt?: Date | undefined;
    }
  > {
    return await prisma.thread.create({
      data: { ...params, session: { connect: { id: id! } } },
    });
  }
  async getById(id: string): Promise<
    | ({ goals: string } & {
        sessionId: string;
        id: string;
        createdAt: Date;
        updatedAt?: Date | undefined;
      })
    | null
  > {
    return await prisma.thread.findUnique({ where: { id } });
  }
  async getAll(id: string): Promise<
    ({ goals: string } & {
      sessionId: string;
      id: string;
      createdAt: Date;
      updatedAt?: Date | undefined;
    })[]
  > {
    return await prisma.thread.findMany({ where: { sessionId: id } });
  }
}
