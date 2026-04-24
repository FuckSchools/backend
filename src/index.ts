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
app.use('/projects', projectRouter);
app.use('/sessions', sessionRouter);
app.use('/trees', treeRouter);
app.use('/nodes', nodeRouter);
app.use('/threads', threadRouter);

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
