import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { Config } from '../../config/env';
import { ErrorMessages } from '../../core/constants/error_messages';
import {
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from '../../config/constants';
import { AppError } from '../../core/types/app_error';
import { HttpStatus } from '../../core/constants/http_status';

export function generateAccessToken(userId: number) {
  const payload = {
    userId,
    exp: Date.now() + ACCESS_TOKEN_MAX_AGE,
  } as Payload;
  return sign(payload, Config.env.accessTokenSecret);
}

export function generateRefreshToken(userId: number) {
  const payload = {
    userId,
    exp: Date.now() + REFRESH_TOKEN_MAX_AGE,
  } as Payload;
  return sign(payload, Config.env.refreshTokenSecret);
}

export function verifyAccessToken(accessToken: string) {
  const payload = verify(accessToken, Config.env.accessTokenSecret);
  if (typeof payload === 'string') {
    throw AppError.new({
      message: ErrorMessages.INVALID_TOKEN,
      status: HttpStatus.UNAUTHORIZED,
    });
  }

  if (isExpiredToken(payload as Payload)) {
    throw AppError.new({
      message: ErrorMessages.EXPIRED_ACCESS_TOKEN,
      status: HttpStatus.UNAUTHORIZED,
    });
  }

  return (payload as Payload).userId;
}

export function verifyRefreshToken(refreshToken: string) {
  const payload = verify(refreshToken, Config.env.refreshTokenSecret);
  if (typeof payload === 'string') {
    throw AppError.new({
      message: ErrorMessages.INVALID_TOKEN,
      status: HttpStatus.UNAUTHORIZED,
    });
  }

  if (isExpiredToken(payload as Payload)) {
    throw AppError.new({
      message: ErrorMessages.EXPIRED_REFRESH_TOKEN,
      status: HttpStatus.UNAUTHORIZED,
    });
  }

  return (payload as Payload).userId;
}

interface Payload extends JwtPayload {
  userId: number;
  exp: number;
}

function isExpiredToken({ exp }: Payload) {
  return Date.now() > exp;
}
