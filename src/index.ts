import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { clerkMiddleware } from '@clerk/express';
import { authRouter } from './routes/auth.route.js';
const app: express.Application = express();
const port = Number(process.env['PORT']);
import morgan from 'morgan';

app.use(
  morgan('dev'),
  cors(),
  clerkMiddleware(),
  express.json(),
  express.urlencoded({ extended: true }),
  helmet(),
);
app.use('/auth', authRouter);

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
