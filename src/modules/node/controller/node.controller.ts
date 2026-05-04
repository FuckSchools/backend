import type { RepositoryInjectionType } from '../../../DI/repository.js';
import express from 'express';
import { GetTree } from '../application/getTree.js';

export class NodeController {
  constructor(private readonly repositoryInjection: RepositoryInjectionType) {}

  async getTree(req: express.Request, res: express.Response) {
    const projectId = req.params['projectId'] as string;
    const getTreeUseCase = new GetTree(
      this.repositoryInjection.rootNodeRepository,
    );
    try {
      const tree = await getTreeUseCase.execute(projectId);
      res.json(tree);
    } catch (error) {
      console.error('Error fetching tree:', error);
      res.status(500).json({ error: 'Failed to fetch tree' });
    }
  }
}
