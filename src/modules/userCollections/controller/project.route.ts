import {
  createProjectController,
  getProjectController,
} from './project.controller.js';
import express from 'express';

const router: express.Router = express.Router();

router.post('/', createProjectController);
router.get('/:projectId', getProjectController);
router.get('/', getProjectController);

export const projectRouter = router;
