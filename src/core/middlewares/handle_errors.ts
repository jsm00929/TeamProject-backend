import { Response } from 'express';
import { AppError } from '../types/app_error';
import { HttpStatus } from '../constants/http_status';
import { ErrorMessages } from '../constants/error_messages';
import { clearAuthCookies } from '../../utils/cookie_store';
import { log } from '../../utils/logger';

export function handleErrors(error: Error, _, res: Response, __) {
  log.debug(error);
  if (error instanceof AppError) {
    if (error.message === ErrorMessages.INVALID_TOKEN) {
      clearAuthCookies(res);
    }

    return res.status(error.status).json({
      message: error.message,
    });
  }
  log.error(error);

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: ErrorMessages.INTERNAL_SERVER_ERROR,
  });
}
