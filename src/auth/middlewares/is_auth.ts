import {NextFunction, Response} from 'express';
import { AppError } from '../../core/types/app_error';
import { ErrorMessages } from '../../core/constants/error_messages';
import { ACCESS_TOKEN_COOKIE_NAME } from '../../config/constants';
import { verifyAccessToken } from '../../utils/token';
import { OptionalAuthRequest } from '../../core/types';
import { HttpStatus } from '../../core/constants';
import {clearAuthCookies} from "../../utils/cookie_store";

export function isAuth(req: OptionalAuthRequest, res: Response, next: NextFunction) {
  const accessToken = req.cookies[ACCESS_TOKEN_COOKIE_NAME];

  if (accessToken) {
    try {
      const userId = verifyAccessToken(accessToken);
      req.userId = userId;
    } catch (e) {
      // 유효하지 않거나 만료된 토큰일 경우 쿠키를 지우고 에러를 던진다.
      clearAuthCookies(res);
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
