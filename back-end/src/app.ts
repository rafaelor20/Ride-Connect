import 'reflect-metadata';
import 'express-async-errors';
import express, { Express } from 'express';
import cors from 'cors';

import { loadEnv, connectDb, disconnectDB } from '@/config';

loadEnv();

import { authenticateToken, handleApplicationErrors } from '@/middlewares';
import { usersRouter, authenticationRouter, rideRouter } from '@/routers';

const app = express();
app
  .use(cors())
  .use(express.json())
  .get('/health', (req: express.Request, res: express.Response) => res.send('OK!'))
  .use('/users', usersRouter)
  .use('/auth', authenticationRouter)
  .use('/ride', authenticateToken, rideRouter)
  .use(handleApplicationErrors);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
