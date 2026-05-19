import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/errors';
import { verifyToken } from '../utils/jwt';

export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.header('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new AppError(401, 'Authorization token is required'));
    return;
  }

  const token = authHeader.slice(7).trim();

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new AppError(401, 'Invalid or expired token'));
  }
};
