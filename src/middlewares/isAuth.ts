import { NextFunction } from 'express';
import { TOKEN } from '../config/constants';
import { AuthRequest } from '../types/AuthRequest';
import { verifyToken } from '../utils/verifyToken';
import { AppError } from '../types/AppError';
import { ErrorMessages } from '../types/ErrorMessages';

export function isAuth(req: AuthRequest, _, next: NextFunction) {
  const token = req.cookies[TOKEN];
  if (token) {
    try {
      const me = verifyToken(token);
      req.me = me;
    } catch (e) {
      next(
        AppError.create({
          message: ErrorMessages.INVALID_TOKEN,
        }),
      );
    }
  }
  next();
}
