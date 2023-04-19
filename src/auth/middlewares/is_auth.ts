import { NextFunction } from 'express';
import { AppError } from '../../core/types/app_error';
import { ErrorMessages } from '../../core/constants/error_messages';
import { ACCESS_TOKEN_COOKIE_NAME } from '../../config/constants';
import { verifyAccessToken } from '../../utils/token';
import { OptionalAuthRequest } from '../../core/types';
import { HttpStatus } from '../../core/constants';

export function isAuth(req: OptionalAuthRequest, _, next: NextFunction) {
  const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];

  if (accessToken) {
    try {
      const userId = verifyAccessToken(accessToken);
      req.userId = userId;
    } catch (e) {
      return next(
        AppError.new({
          message: ErrorMessages.INVALID_TOKEN,
          status: HttpStatus.UNAUTHORIZED,
        }),
      );
    }
  }
  next();
}
