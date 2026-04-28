import {
  createNodeController,
  getNodeController,
} from '@/modules/node/controller/node.controller.js';
import express from 'express';

const router: express.Router = express.Router();

router.get('/:nodeId', getNodeController);
router.post('/:nodeId/children', createNodeController);

export const nodeRouter = router;
