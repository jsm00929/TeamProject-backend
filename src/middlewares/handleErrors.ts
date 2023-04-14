import { Response } from 'express';
import { AppError } from '../types/AppError';
import { HttpStatus } from '../types/HttpStatus';
import { ErrorMessages } from '../types/ErrorMessages';

export function handleErrors(error: Error, _, res: Response) {
  if (error instanceof AppError) {
    return res.status(error.status).json({
      message: error.message,
    });
  }

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: ErrorMessages.INTERNAL_SERVER_ERROR,
  });
}
