import { registerUserController } from '@/controllers/auth.js';
import express from 'express';

const router: express.Router = express.Router();

router.post('/register', registerUserController);

export const authRouter = router;
