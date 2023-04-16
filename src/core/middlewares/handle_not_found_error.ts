import { Response } from 'express';
import { ErrorMessages } from '../constants/error_messages';
import { HttpStatus } from '../constants/http_status';

export function handleNotFoundError(_, res: Response) {
  res.status(HttpStatus.NOT_FOUND).json({
    message: ErrorMessages.NOT_FOUND,
  });
}
