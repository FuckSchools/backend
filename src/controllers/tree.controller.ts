import { createTreeUseCase } from '@/applications/tree/createTree.js';
import { getTreeUseCase } from '@/applications/tree/getTree.js';
import { getInjection } from '@/DI/repository.js';
import { nodeEntity } from '@/entities/node.entity.js';
import { projectEntity } from '@/entities/project.entity.js';
import { treeEntity } from '@/entities/tree.entity.js';
import { userEntity } from '@/entities/user.entity.js';
import { knownErrors } from '@/interfaces/error.interface.js';
import express from 'express';

const treeRepository = getInjection('TreeRepository');

export const createTreeController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = await userEntity.shape.internal.shape.id.parseAsync(
      res.locals['userId'],
    );
    const projectId = await projectEntity.shape.internal.shape.id.parseAsync(
      req.body['projectId'],
    );
    const rootContent =
      await nodeEntity.shape.internal.shape.content.parseAsync(
        req.body['rootContent'],
      );
    const rootPrerequisites =
      await nodeEntity.shape.external.shape.prerequisites.parseAsync(
        req.body['rootPrerequisites'] ?? [],
      );
    const rootStatesOfCompletion =
      await nodeEntity.shape.external.shape.statesOfCompletion.parseAsync(
        req.body['rootStatesOfCompletion'] ?? [],
      );

    const createdTree = await createTreeUseCase(treeRepository)(
      projectId,
      userId,
      rootContent,
      rootPrerequisites,
      rootStatesOfCompletion,
    );

    res.status(201).json(createdTree);
  } catch (error) {
    if (knownErrors.some((KnownError) => error instanceof KnownError)) {
      console.error('🚀 ~ createTreeController ~ error:', error);
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getTreeController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = await userEntity.shape.internal.shape.id.parseAsync(
      res.locals['userId'],
    );
    const treeId = await treeEntity.shape.internal.shape.id.parseAsync(
      req.params['treeId'],
    );

    const tree = await getTreeUseCase(treeRepository)(treeId, userId);

    res.status(200).json(tree);
  } catch (error) {
    if (knownErrors.some((KnownError) => error instanceof KnownError)) {
      console.error('🚀 ~ getTreeController ~ error:', error);
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};
