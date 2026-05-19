import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import authRoutes from './routes/authRoutes';
import leadRoutes from './routes/leadRoutes';
import { errorHandler } from './middleware/errorHandler';
import { AppError } from './utils/errors';

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true
  })
);
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy' });
});

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.use((_req, _res, next) => {
  next(new AppError(404, 'Route not found'));
});

app.use(errorHandler);

export default app;
