import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { clerkMiddleware } from '@clerk/express';
import { authRouter } from './routes/auth.js';
const app: express.Application = express();
const port = Number(process.env['PORT']);

app.use(clerkMiddleware());

app.use(
  cors(),
  express.json(),
  express.urlencoded({ extended: true }),
  helmet(),
);

app.get('/', (_req: express.Request, res: express.Response) => {
  res.send('Hello World!');
});

app.use('/auth', authRouter);

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed, exiting process');
    process.exit(0);
  });
});
