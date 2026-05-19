import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Error as MongooseError } from 'mongoose';
import { AppError } from '../utils/errors';
import type { ApiErrorResponse } from '../types/api';

const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError;
};

const isZodError = (error: unknown): error is ZodError => {
  return error instanceof ZodError;
};

const isMongooseValidationError = (error: unknown): error is MongooseError.ValidationError => {
  return error instanceof MongooseError.ValidationError;
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: unknown;

  if (isAppError(error)) {
    statusCode = error.statusCode;
    message = error.message;
    errors = error.errors;
  } else if (isZodError(error)) {
    statusCode = 400;
    message = 'Validation failed';
    errors = error.flatten();
  } else if (isMongooseValidationError(error)) {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(error.errors).map((validationError) => validationError.message);
  } else if (error instanceof Error) {
    message = error.message;
  }

  const response: ApiErrorResponse = {
    success: false,
    message
  };

  if (errors !== undefined) {
    response.errors = errors;
  }

  res.status(statusCode).json(response);
};
