import type { JWTPayload } from './auth';

declare module 'express-serve-static-core' {
  interface Request {
    user?: JWTPayload;
  }
}

export {};
