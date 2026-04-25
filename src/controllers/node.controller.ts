import { createChildNodeUseCase } from '@/applications/node/createChildNode.js';
import { getNodeUseCase } from '@/applications/node/getNode.js';
import { getInjection } from '@/DI/repository.js';
import { nodeEntity } from '@/entities/node.entity.js';
import express from 'express';

const nodeRepository = getInjection('NodeRepository');

export const createNodeController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const parentId = await nodeEntity.shape.internal.shape.id.parseAsync(
      req.params['parentId'],
    );
    const content = await nodeEntity.shape.internal.shape.content.parseAsync(
      req.body['content'],
    );

    const createdNode = await createChildNodeUseCase(nodeRepository)({
      parentId,
      content,
    });

    res.status(201).json(createdNode);
  } catch (error) {
    console.error('🚀 ~ createChildNodeController ~ error:', error);

    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getNodeController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const nodeId = await nodeEntity.shape.internal.shape.id.parseAsync(
      req.params['nodeId'],
    );

    const node = await getNodeUseCase(nodeRepository)({ nodeId });

    res.status(200).json(node);
  } catch (error) {
    console.error('🚀 ~ getNodeController ~ error:', error);

    res.status(500).json({ message: 'Internal server error' });
  }
};
