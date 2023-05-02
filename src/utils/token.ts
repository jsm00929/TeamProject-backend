import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { Config } from '../config/env';
import { ErrorMessages } from '../core/constants/error_messages';
import {
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from '../config/constants';
import { AppError } from '../core/types/app_error';
import { HttpStatus } from '../core/constants/http_status';

const { accessTokenSecret, refreshTokenSecret } = Config.env;

export function generateAccessToken(
  userId: number,
  maxAge: number = ACCESS_TOKEN_MAX_AGE,
) {
  const payload = {
    userId,
    exp: Date.now() + maxAge,
  } as Payload;

  return sign(payload, accessTokenSecret);
}

export function generateRefreshToken(
  userId: number,
  maxAge: number = REFRESH_TOKEN_MAX_AGE,
) {
  const payload = {
    userId,
    exp: Date.now() + maxAge,
  } as Payload;
  return sign(payload, refreshTokenSecret);
}

export function verifyAccessToken(accessToken: string) {
  let payload: Payload;
  try {
    payload = verify(accessToken, accessTokenSecret) as Payload;
  } catch (error) {
    throw AppError.new({
      message: ErrorMessages.INVALID_TOKEN,
      status: HttpStatus.UNAUTHORIZED,
    });
  }

  if (isExpiredToken(payload)) {
    throw AppError.newWithCode({
      message: ErrorMessages.EXPIRED_ACCESS_TOKEN,
      status: HttpStatus.UNAUTHORIZED,
      code: -1
    });
  }

  return payload.userId;
}

export function verifyRefreshToken(refreshToken: string) {
  let payload: Payload;
  try {
    payload = verify(refreshToken, refreshTokenSecret) as Payload;
  } catch (error) {
    throw AppError.new({
      message: ErrorMessages.INVALID_TOKEN,
      status: HttpStatus.UNAUTHORIZED,
    });
  }

  if (isExpiredToken(payload)) {
    throw AppError.newWithCode({
      message: ErrorMessages.EXPIRED_REFRESH_TOKEN,
      status: HttpStatus.UNAUTHORIZED,
      code:-1,
    });
  }

  return payload.userId;
}

interface Payload extends JwtPayload {
  userId: number;
  exp: number;
}

function isExpiredToken({ exp }: Payload) {
  return Date.now() > exp;
}
