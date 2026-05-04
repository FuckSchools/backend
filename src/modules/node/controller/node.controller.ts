import type { RepositoryInjectionType } from '../../../DI/repository.js';
import express from 'express';
import { PrintTree } from '../application/printTree.js';

export class NodeController {
  constructor(private readonly repositoryInjection: RepositoryInjectionType) {}

  async getTree(req: express.Request, res: express.Response) {
    const projectId = req.params['projectId'] as string;
    const printTreeUseCase = new PrintTree(
      this.repositoryInjection.rootNodeRepository,
    );
    try {
      const tree = await printTreeUseCase.execute(projectId);
      res.json(tree);
    } catch (error) {
      console.error('Error fetching tree:', error);
      res.status(500).json({ error: 'Failed to fetch tree' });
    }
  }
}
