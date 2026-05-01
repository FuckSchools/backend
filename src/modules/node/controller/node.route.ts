import express from 'express';
import { nodeController } from './node.controller.js';

const router: express.Router = express.Router();

router.get('/:projectId', nodeController);

export const nodeRouter = router;
