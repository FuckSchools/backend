import {
  createProjectController,
  getProjectController,
} from '@/controllers/project.controller.js';
import express from 'express';

const router: express.Router = express.Router();

router.post('/', createProjectController);
router.get('/:projectId', getProjectController);

export const projectRouter = router;
