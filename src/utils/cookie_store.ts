import { Response } from 'express';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from '../config/constants';
import { REFRESH_TOKEN_COOKIE_NAME } from '../config/constants';
import { generateAccessToken, generateRefreshToken } from './token';

export function setAuthCookies(userId: number, res: Response) {
  setAccessTokenCookie(userId, res);
  setRefreshTokenCookie(userId, res);
}

export function clearAuthCookies(res: Response) {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
}

export function setAccessTokenCookie(userId: number, res: Response) {
  const accessToken = generateAccessToken(userId);

  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    path: '/',
    maxAge: ACCESS_TOKEN_MAX_AGE,
    signed: true,
    httpOnly: true,
  });
}

export function setRefreshTokenCookie(userId: number, res: Response) {
  const refreshToken = generateRefreshToken(userId);

  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    path: '/',
    maxAge: REFRESH_TOKEN_MAX_AGE,
    signed: true,
    httpOnly: true,
  });
}
