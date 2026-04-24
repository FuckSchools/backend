import { treeEntity } from '@/entities/tree.entity.js';
import { userEntity } from '@/entities/user.entity.js';
import { knownErrors } from '@/interfaces/error.interface.js';
import type { ITreeRepository } from '@/interfaces/repository/tree.interface.js';
import type { z } from 'zod';

export const getTreeUseCase =
  (TreeRepository: ITreeRepository) =>
  async (
    treeId: z.infer<typeof treeEntity.shape.internal.shape.id>,
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
  ): Promise<z.infer<typeof treeEntity>> => {
    try {
      const tree = await TreeRepository.getById(
        await treeEntity.shape.internal.shape.id.parseAsync(treeId),
        await userEntity.shape.internal.shape.id.parseAsync(userId),
      );

      return tree;
    } catch (error) {
      if (knownErrors.some((KnownError) => error instanceof KnownError)) {
        console.error('🚀 ~ getTreeUseCase ~ error:', error);
      }

      throw error;
    }
  };
