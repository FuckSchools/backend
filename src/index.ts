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
import { sessionRoute } from '@/session/controller/session.route.js';
import { nodeRouter } from '@/node/controller/node.route.js';
import {
  DuplicatedCreationError,
  IllegalOperationError,
  NodeUnknownError,
  NotFoundError,
  PrismaError,
  UnauthorizedError,
} from '@/shared/domain/interface/error.interface.js';

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
app.use('/sessions', sessionRoute(repositoryInjection.prisma));
app.use('/nodes', nodeRouter(repositoryInjection.prisma));

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    if (error instanceof UnauthorizedError) {
      res.status(401).json({ error: error.message });
      return;
    }

    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
      return;
    }

    if (error instanceof DuplicatedCreationError) {
      res.status(409).json({ error: error.message });
      return;
    }

    if (error instanceof NodeUnknownError || error instanceof IllegalOperationError) {
      res.status(409).json({ error: error.message });
      return;
    }

    if (error instanceof PrismaError) {
      res.status(500).json({ error: error.message });
      return;
    }

    console.error('Unhandled server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  },
);

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
