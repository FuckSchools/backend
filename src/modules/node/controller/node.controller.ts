import { getProject } from '@/project/application/getProject.js';
import express from 'express';
import { getNodesByProjectId } from '../application/rootNodeHandler.js';
import type { RepositoryInjectionType } from '../../../DI/repository.js';
export const nodeController =
  (repository: RepositoryInjectionType) =>
  async (req: express.Request, res: express.Response) => {
    try {
      const userId = res.locals['userId'] as string;
      const projectId = req.params['projectId'] as string;

      const project = await getProject(repository.projectRepository)(
        projectId,
        userId,
      );

      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      const nodes = await getNodesByProjectId(repository.rootNodeRepository)(
        project.id,
      );
      res.status(200).json(nodes);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
      throw error;
    }
  };
