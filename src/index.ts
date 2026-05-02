import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { clerkMiddleware } from '@clerk/express';
import { projectRouter } from '@/project/controller/project.route.js';
const app: express.Application = express();
const port = Number(process.env['PORT']);
import morgan from 'morgan';
import { authMiddleware } from '@/user/controller/auth.middleware.js';
import { nodeRouter } from '@/node/controller/node.route.js';
import { sessionController } from '@/session/controller/session.route.js';
import { repositoryInjection } from './DI/repository.js';

app.use(
  morgan('dev'),
  cors(),
  clerkMiddleware(),
  express.json(),
  express.urlencoded({ extended: true }),
  helmet(),
  authMiddleware(repositoryInjection.prisma.userRepository),
);
app.use('/', projectRouter(repositoryInjection.prisma.projectRepository));
app.use('/nodes', nodeRouter(repositoryInjection.prisma));
app.use('/', sessionController(repositoryInjection.prisma.sessionRepository));

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
