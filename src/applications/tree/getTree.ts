import { projectEntity } from '@/entities/project.entity.js';
import { treeEntity } from '@/entities/tree.entity.js';
import type { ITreeRepository } from '@/interfaces/repository/tree.interface.js';
import type { z } from 'zod';

export const getTreeUseCase =
  (TreeRepository: ITreeRepository) =>
  async (data: {
    projectId: z.infer<typeof projectEntity.shape.internal.shape.id>;
  }): Promise<z.infer<typeof treeEntity>> => {
    try {
      const tree = await TreeRepository.getByProjectId(data.projectId);

      return tree;
    } catch (error) {
      console.error('🚀 ~ getTreeUseCase ~ error:', error);

      throw error;
    }
  };
