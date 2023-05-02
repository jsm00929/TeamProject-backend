import { Response } from 'express';
import { AppError } from '../types/AppError';
import { HttpStatus } from '../types/HttpStatus';
import { ErrorMessages } from '../types/ErrorMessages';

export function handleErrors(error: Error, _, res: Response, __) {
  //log.debug(error);
  if (error instanceof AppError) {
    if (error.message === ErrorMessages.INVALID_TOKEN) {
      //clearAuthCookies(res);
    }

    // const { code, message, status } = error;

    // if (code !== undefined) {
    //   return res.status(error.status).json({ message, code });
    // }
    const { message, status } = error;
    return res.status(status).json({ message });
  }
  //log.error(error);

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: ErrorMessages.INTERNAL_SERVER_ERROR,
  });
}
