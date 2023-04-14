import { NextFunction } from 'express';
import { TOKEN } from '../config/constants';
import { AuthRequest } from '../types/AuthRequest';
import { verifyToken } from '../utils/verifyToken';
import { AppError } from '../types/AppError';
import { ErrorMessages } from '../types/ErrorMessages';
import { HttpStatus } from '../types/HttpStatus';

export function mustAuth(req: AuthRequest, _, next: NextFunction) {
  const token = req.cookies[TOKEN];
  if (!token) {
    next(
      AppError.create({
        message: ErrorMessages.UNAUTHORIZED_USER,
        status: HttpStatus.UNAUTHORIZED,
      }),
    );
  }
  try {
    const me = verifyToken(token);
    req.me = me;
    next();
  } catch (e) {
    next(
      AppError.create({
        message: ErrorMessages.INVALID_TOKEN,
      }),
    );
  }
}
