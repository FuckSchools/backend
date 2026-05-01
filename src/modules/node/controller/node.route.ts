import express from 'express';

const router: express.Router = express.Router();

router.get('/:projectId');
router.get('/:projectId/:nodeId');

export const nodeRouter = router;
