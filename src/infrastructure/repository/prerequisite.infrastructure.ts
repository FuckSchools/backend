import { prisma } from '@/config/prisma.js';
import type { prerequisiteCreationEntity } from '@/entities/prerequisite.entity.js';
import { CustomError } from '@/interfaces/error.interface.js';
import type { IPrerequisiteRepository } from '@/interfaces/repository/prerequisite.interface.js';
import type {
  output,
  ZodObject,
  ZodUUID,
  ZodString,
  ZodEnum,
  ZodDate,
} from 'zod';
import type { $strip } from 'zod/v4/core';

export class PrerequisiteRepository implements IPrerequisiteRepository {
  async create(data: output<typeof prerequisiteCreationEntity>): Promise<
    output<
      ZodObject<
        {
          id: ZodUUID;
          content: ZodString;
          status: ZodEnum<{
            NOT_STARTED: 'NOT_STARTED';
            IN_PROGRESS: 'IN_PROGRESS';
            COMPLETED: 'COMPLETED';
          }>;
          updatedAt: ZodDate;
          createdAt: ZodDate;
        },
        $strip
      >
    >
  > {
    try {
      return await prisma.prerequisite.create({
        data: {
          content: data.content,
          status: data.status,
          node: {
            connect: {
              id: data.nodeId,
            },
          },
        },
      });
    } catch (error) {
      console.error('🚀 ~ PrerequisiteRepository ~ create ~ error:', error);
      throw new CustomError(
        'Failed to create prerequisite.',
        'IllegalOperationError',
      );
    }
  }
}
