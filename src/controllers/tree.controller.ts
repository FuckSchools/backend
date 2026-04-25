import { getTreeUseCase } from '@/applications/tree/getTree.js';
import { getInjection } from '@/DI/repository.js';
import { projectEntity } from '@/entities/project.entity.js';
import express from 'express';

const treeRepository = getInjection('TreeRepository');

export const getTreeController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const projectId = await projectEntity.shape.internal.shape.id.parseAsync(
      req.params['projectId'],
    );

    const tree = await getTreeUseCase(treeRepository)({ projectId });

    res.status(200).json(tree);
  } catch (error) {
    console.error('🚀 ~ getTreeController ~ error:', error);

    res.status(500).json(error);
  }
};
