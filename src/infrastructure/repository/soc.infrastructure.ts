import type { socCreationEntity } from '@/entities/soc.entity.js';
import type { IStateOfCompletionRepository } from '@/interfaces/repository/soc.interface.js';
import type {
  output,
  ZodObject,
  ZodUUID,
  ZodString,
  ZodEnum,
  ZodDate,
} from 'zod';
import type { $strip } from 'zod/v4/core';
import { prisma } from '@/config/prisma.js';
import { CustomError } from '@/interfaces/error.interface.js';

export class StateOfCompletionRepository implements IStateOfCompletionRepository {
  async create(data: output<typeof socCreationEntity>): Promise<
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
          createdAt: ZodDate;
          updatedAt: ZodDate;
        },
        $strip
      >
    >
  > {
    try {
      return await prisma.stateOfCompletion.create({ data });
    } catch (error) {
      console.error(
        '🚀 ~ StateOfCompletionRepository ~ create ~ error:',
        error,
      );
      throw new CustomError(
        'Failed to create state of completion.',
        'IllegalOperationError',
      );
    }
  }
}
