import { NextFunction, Response } from 'express';
import { AppError } from '../../core/types/app_error';
import { ErrorMessages } from '../../core/constants/error_messages';
import { HttpStatus } from '../../core/constants/http_status';
import { ACCESS_TOKEN_COOKIE_NAME } from '../../config/constants';
import { verifyAccessToken } from '../../utils/token';
import { AuthRequest } from '../../core/types';

export function mustAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const accessToken = req.signedCookies[ACCESS_TOKEN_COOKIE_NAME];
  if (!accessToken) {
    next(
      AppError.new({
        message: ErrorMessages.UNAUTHORIZED_USER,
        status: HttpStatus.UNAUTHORIZED,
      }),
    );
  }
  try {
    const userId = verifyAccessToken(accessToken);
    req.userId = userId;
    next();
  } catch (e) {
    next(
      AppError.new({
        message: ErrorMessages.INVALID_TOKEN,
        status: HttpStatus.UNAUTHORIZED,
      }),
    );
  }
}
