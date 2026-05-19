import type { Response } from 'express';
import type { ApiSuccessResponse } from '../types/api';

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T
): Response<ApiSuccessResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};
