import type { PrintTree } from '../application/printTree.js';
import express from 'express';

export class NodeController {
  constructor(private readonly printTreeUseCase: PrintTree) {}

  getTree = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const projectId = req.params['projectId'] as string;

    try {
      const tree = await this.printTreeUseCase.execute(projectId);
      if (!tree) {
        res.status(404).json({ error: 'Project tree not found' });
        return;
      }
      res.json(tree);
    } catch (error) {
      next(error);
    }
  };
}
