import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import type { JWTPayload } from '../types/auth';

export const signToken = (payload: JWTPayload): string => {
  const expiresIn = env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'];

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn
  });
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
};
