import { getThreadController } from '@/controllers/thread.controller.js';
import { createMessageController } from '@/controllers/message.controller.js';
import express from 'express';

const router: express.Router = express.Router();

router.get('/:threadId', getThreadController);
router.post('/:threadId/messages', createMessageController);

export const threadRouter = router;
