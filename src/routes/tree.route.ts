import {
  createTreeController,
  getTreeController,
} from '@/controllers/tree.controller.js';
import express from 'express';

const router: express.Router = express.Router();

router.post('/', createTreeController);
router.get('/:treeId', getTreeController);

export const treeRouter = router;
