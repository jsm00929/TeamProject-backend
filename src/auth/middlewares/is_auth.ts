import { NextFunction } from 'express';
import { AppError } from '../../core/types/app_error';
import { ErrorMessages } from '../../core/constants/error_messages';
import { ACCESS_TOKEN_COOKIE_NAME } from '../../config/constants';
import { verifyAccessToken } from '../../utils/token/token';
import { OptionalAuthRequest } from '../../core/types';

export function isAuth(req: OptionalAuthRequest, _, next: NextFunction) {
  const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];

  if (accessToken) {
    try {
      const userId = verifyAccessToken(accessToken);
      req.userId = userId;

      next();
    } catch (e) {
      next(
        AppError.create({
          message: ErrorMessages.INVALID_TOKEN,
        }),
      );
    }
  }
}
