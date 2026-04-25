import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { clerkMiddleware } from '@clerk/express';
import { authRouter } from './routes/auth.route.js';
import { nodeRouter } from './routes/node.route.js';
import { projectRouter } from './routes/project.route.js';
import { sessionRouter } from './routes/session.route.js';
import { threadRouter } from './routes/thread.route.js';
import { treeRouter } from './routes/tree.route.js';
const app: express.Application = express();
const port = Number(process.env['PORT']);
import morgan from 'morgan';
import { authMiddleware } from './middlewares/auth.middleware.js';
import { userMiddleware } from './middlewares/user.middleware.js';

app.use(
  morgan('dev'),
  cors(),
  clerkMiddleware(),
  express.json(),
  express.urlencoded({ extended: true }),
  helmet(),
  authMiddleware,
);
app.use('/auth', authRouter);
app.use('/projects', userMiddleware, projectRouter);
app.use('/sessions', userMiddleware, sessionRouter);
app.use('/trees', userMiddleware, treeRouter);
app.use('/nodes', userMiddleware, nodeRouter);
app.use('/threads', userMiddleware, threadRouter);

const server = app.listen(port, () => {
  console.log('🚀 ~ port:', port);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed, exiting process');
    process.exit(0);
  });
});
