import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { clerkMiddleware } from '@clerk/express';
import { nodeRouter } from './modules/node/controller/node.route.js';
import { projectRouter } from './modules/project/controller/project.route.js';
import { sessionRouter } from './modules/session/controller/session.route.js';
import { threadRouter } from './modules/thread/controller/thread.route.js';
const app: express.Application = express();
const port = Number(process.env['PORT']);
import morgan from 'morgan';
import { authMiddleware } from './modules/user/controller/auth.middleware.js';

app.use(
  morgan('dev'),
  cors(),
  clerkMiddleware(),
  express.json(),
  express.urlencoded({ extended: true }),
  helmet(),
  authMiddleware,
);
app.use('/projects', projectRouter);
app.use('/sessions', sessionRouter);
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
