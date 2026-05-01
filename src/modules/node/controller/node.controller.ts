import { getProject } from '@/userCollections/application/getProject.js';
import { UserCollectionRepository } from '@/userCollections/infrastructure/repository/user.repository.js';
import express from 'express';
import { getNodesByProjectId } from '../application/rootNodeHandler.js';
import { RootNodeRepository } from '../infrastructure/repository/node.repository.js';
export const nodeController = async (
  req: express.Request,
  res: express.Response,
) => {
  try {
    const userId = res.locals['userId'] as string;
    const projectId = req.params['projectId'] as string;

    const project = await getProject(new UserCollectionRepository())(
      projectId,
      userId,
    );

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const nodes = await getNodesByProjectId(new RootNodeRepository())(
      project.id,
    );
    res.json(nodes).status(200);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    throw error;
  }
};
