import {
  createSessionController,
  createThreadController,
  getSessionController,
} from '@/modules/session/controller/session.controller.js';
import express from 'express';

const router: express.Router = express.Router();

router.post('/', createSessionController);
router.get('/:sessionId', getSessionController);
router.post('/:sessionId/threads', createThreadController);

export const sessionRouter = router;
