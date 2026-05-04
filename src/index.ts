import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { clerkMiddleware } from '@clerk/express';
import { projectRouter } from './modules/userCollections/controller/project.route.js';
const app: express.Application = express();
const port = Number(process.env['PORT']);
import morgan from 'morgan';
import { authMiddleware } from './modules/userCollections/controller/auth.middleware.js';
import { repositoryInjection } from './DI/repository.js';
import { projectAuthMiddleware } from '@/session/controller/projectAuth.middleware.js';
import { sessionRoute } from '@/session/controller/session.route.js';

app.use(
  morgan('dev'),
  cors(),
  clerkMiddleware(),
  express.json(),
  express.urlencoded({ extended: true }),
  helmet(),
  authMiddleware(repositoryInjection.prisma),
);
app.use('/', projectRouter(repositoryInjection.prisma));
app.use(
  '/sessions',
  projectAuthMiddleware(repositoryInjection.prisma),
  sessionRoute(repositoryInjection.prisma),
);
// app.use('/nodes', nodeRouter(repositoryInjection.prisma));

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
