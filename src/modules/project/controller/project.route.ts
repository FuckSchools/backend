import {
  createProjectController,
  getProjectController,
} from '@/project/controller/project.controller.js';
import express from 'express';

const router: express.Router = express.Router();

router.post('/', createProjectController);
router.get('/:projectId', getProjectController);

export const projectRouter = router;
