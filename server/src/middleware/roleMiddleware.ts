import type { NextFunction, Request, Response } from 'express';
import type { UserRole } from '../types/auth';
import { AppError } from '../utils/errors';

export const roleMiddleware = (allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      next(new AppError(403, 'You do not have permission to perform this action'));
      return;
    }

    next();
  };
};
