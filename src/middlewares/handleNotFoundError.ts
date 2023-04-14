import { Response } from 'express';
import { ErrorMessages } from '../types/ErrorMessages';
import { HttpStatus } from '../types/HttpStatus';

export function handleNotFoundError(_, res: Response) {
  res.status(HttpStatus.NOT_FOUND).json({
    message: ErrorMessages.NOT_FOUND,
  });
}
