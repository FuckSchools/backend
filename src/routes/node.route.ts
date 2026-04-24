import {
  createChildNodeController,
  getNodeController,
} from '@/controllers/node.controller.js';
import express from 'express';

const router: express.Router = express.Router();

router.get('/:nodeId', getNodeController);
router.post('/:nodeId/children', createChildNodeController);

export const nodeRouter = router;
