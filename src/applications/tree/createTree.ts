import { nodeEntity } from '@/entities/node.entity.js';
import { projectEntity } from '@/entities/project.entity.js';
import { treeEntity } from '@/entities/tree.entity.js';
import { userEntity } from '@/entities/user.entity.js';
import { knownErrors } from '@/interfaces/error.interface.js';
import type { ITreeRepository } from '@/interfaces/repository/tree.interface.js';
import type { z } from 'zod';

export const createTreeUseCase =
  (TreeRepository: ITreeRepository) =>
  async (
    projectId: z.infer<typeof projectEntity.shape.internal.shape.id>,
    userId: z.infer<typeof userEntity.shape.internal.shape.id>,
    rootContent: z.infer<typeof nodeEntity.shape.internal.shape.content>,
    rootPrerequisites: z.infer<
      typeof nodeEntity.shape.external.shape.prerequisites
    >,
    rootStatesOfCompletion: Array<{
      content: z.infer<
        typeof nodeEntity.shape.external.shape.statesOfCompletion.element.shape.content
      >;
      status: z.infer<
        typeof nodeEntity.shape.external.shape.statesOfCompletion.element.shape.status
      >;
    }>,
  ): Promise<z.infer<typeof treeEntity>> => {
    try {
      const tree = await TreeRepository.create(
        await projectEntity.shape.internal.shape.id.parseAsync(projectId),
        await userEntity.shape.internal.shape.id.parseAsync(userId),
        await nodeEntity.shape.internal.shape.content.parseAsync(rootContent),
        await nodeEntity.shape.external.shape.prerequisites.parseAsync(
          rootPrerequisites,
        ),
        await Promise.all(
          rootStatesOfCompletion.map(async (stateOfCompletion) => ({
            content:
              await nodeEntity.shape.external.shape.statesOfCompletion.element.shape.content.parseAsync(
                stateOfCompletion.content,
              ),
            status:
              await nodeEntity.shape.external.shape.statesOfCompletion.element.shape.status.parseAsync(
                stateOfCompletion.status,
              ),
          })),
        ),
      );

      return tree;
    } catch (error) {
      if (knownErrors.some((KnownError) => error instanceof KnownError)) {
        console.error('🚀 ~ createTreeUseCase ~ error:', error);
      }

      throw error;
    }
  };
