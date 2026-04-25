import { getTreeController } from '@/controllers/tree.controller.js';
import express from 'express';

const router: express.Router = express.Router();

router.get('/:treeId', getTreeController);

export const treeRouter = router;
