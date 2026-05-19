import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().min(1, 'JWT_EXPIRES_IN is required').default('7d'),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_URL: z.string().url('CLIENT_URL must be a valid URL')
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const message = parsedEnv.error.issues.map((issue) => issue.message).join(', ');
  throw new Error(`Environment validation failed: ${message}`);
}

export const env = parsedEnv.data;
