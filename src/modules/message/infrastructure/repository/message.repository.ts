import { prisma } from '@/config/prisma.js';
import type { IMessageRepository } from '../../domain/interface/message.interface.js';

export class MessageRepository implements IMessageRepository {
  async create(
    params: { role: 'HUMAN' | 'SYSTEM' | 'AI' | 'TOOL'; content: string },
    id?: string,
  ): Promise<
    { role: 'HUMAN' | 'SYSTEM' | 'AI' | 'TOOL'; content: string } & {
      threadId: string;
      id: string;
      createdAt: Date;
      updatedAt?: Date | undefined;
    }
  > {
    return await prisma.message.create({
      data: { ...params, thread: { connect: { id: id! } } },
    });
  }
  async getById(id: string): Promise<
    | ({ role: 'HUMAN' | 'SYSTEM' | 'AI' | 'TOOL'; content: string } & {
        threadId: string;
        id: string;
        createdAt: Date;
        updatedAt?: Date | undefined;
      })
    | null
  > {
    return await prisma.message.findUnique({ where: { id } });
  }
  async getAll(id: string): Promise<
    ({ role: 'HUMAN' | 'SYSTEM' | 'AI' | 'TOOL'; content: string } & {
      threadId: string;
      id: string;
      createdAt: Date;
      updatedAt?: Date | undefined;
    })[]
  > {
    return await prisma.message.findMany({ where: { threadId: id } });
  }
}
