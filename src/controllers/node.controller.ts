import { createChildNodeUseCase } from '@/applications/node/createChildNode.js';
import { getNodeUseCase } from '@/applications/node/getNode.js';
import { getInjection } from '@/DI/repository.js';
import { nodeEntity } from '@/entities/node.entity.js';
import { userEntity } from '@/entities/user.entity.js';
import { knownErrors } from '@/interfaces/error.interface.js';
import express from 'express';

const nodeRepository = getInjection('NodeRepository');

export const createChildNodeController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = await userEntity.shape.internal.shape.id.parseAsync(
      res.locals['userId'],
    );
    const parentNodeId = await nodeEntity.shape.internal.shape.id.parseAsync(
      req.params['nodeId'],
    );
    const content = await nodeEntity.shape.internal.shape.content.parseAsync(
      req.body['content'],
    );
    const prerequisites =
      await nodeEntity.shape.external.shape.prerequisites.parseAsync(
        req.body['prerequisites'] ?? [],
      );
    const statesOfCompletion =
      await nodeEntity.shape.external.shape.statesOfCompletion.parseAsync(
        req.body['statesOfCompletion'] ?? [],
      );

    const createdNode = await createChildNodeUseCase(nodeRepository)(
      parentNodeId,
      userId,
      content,
      prerequisites,
      statesOfCompletion,
    );

    res.status(201).json(createdNode);
  } catch (error) {
    if (knownErrors.some((KnownError) => error instanceof KnownError)) {
      console.error('🚀 ~ createChildNodeController ~ error:', error);
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getNodeController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = await userEntity.shape.internal.shape.id.parseAsync(
      res.locals['userId'],
    );
    const nodeId = await nodeEntity.shape.internal.shape.id.parseAsync(
      req.params['nodeId'],
    );

    const node = await getNodeUseCase(nodeRepository)(nodeId, userId);

    res.status(200).json(node);
  } catch (error) {
    if (knownErrors.some((KnownError) => error instanceof KnownError)) {
      console.error('🚀 ~ getNodeController ~ error:', error);
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
};
