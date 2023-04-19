import { Request, Response } from 'express';
import { RequestWith } from '../core/types/request_with';
import { SignupBody } from './dtos/inputs/signup.body';
import authService from './auth.service';
import { HttpStatus } from '../core/constants/http_status';
import { LoginBody } from './dtos/inputs/login.body';
import {
  clearAuthCookies,
  setAccessTokenCookie,
  setAuthCookies,
} from '../utils/cookie_store';
import {
  GOOGLE_LOGIN_OAUTH2_URL,
  GOOGLE_SIGNUP_OAUTH2_URL,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../config/constants';
import { verifyRefreshToken } from '../utils/token';
import { AppResult } from '../core/types/app_result';
import { AppError } from '../core/types';
import { ErrorMessages } from '../core/constants';
import { GoogleLoginCodeQuery } from './dtos/inputs/google_login_code.query';
import { Config } from '../config/env';

const { clientHost, clientPort } = Config.env;

async function signup(req: RequestWith<SignupBody>, res: Response) {
  const signupInput = req.unwrap();
  const userId = await authService.signUp(signupInput);

  setAuthCookies(userId, res);

  return AppResult.new({
    status: HttpStatus.CREATED,
  });
}

async function login(req: RequestWith<LoginBody>, res: Response) {
  const loginInput = req.unwrap();
  const userId = await authService.login(loginInput);

  setAuthCookies(userId, res);
}

async function logout(_, res: Response) {
  clearAuthCookies(res);
}

async function refreshToken(req: Request, res: Response) {
  const token = req.signedCookies[REFRESH_TOKEN_COOKIE_NAME];
  if (typeof token !== 'string') {
    throw AppError.new({
      message: ErrorMessages.INVALID_TOKEN,
      status: HttpStatus.UNAUTHORIZED,
    });
  }
  const userId = verifyRefreshToken(token);

  setAccessTokenCookie(userId, res);
}

async function googleSignup(req: Request, res: Response) {
  res.redirect(GOOGLE_SIGNUP_OAUTH2_URL);
}

async function googleLogin(req: Request, res: Response) {
  res.redirect(GOOGLE_LOGIN_OAUTH2_URL);
}

// TODO: unimplemented
async function googleLoginRedirect(
  req: RequestWith<GoogleLoginCodeQuery>,
  res: Response,
) {
  const { code } = req.unwrap();
  const userId = await authService.googleLoginRedirect(code);

  setAuthCookies(userId, res);
  // return AppResult.redirect(`${clientHost}:${clientPort}`);
  return AppResult.redirect(`/`);
}

async function googleSignupRedirect(
  req: RequestWith<GoogleLoginCodeQuery>,
  res: Response,
) {
  const { code } = req.unwrap();
  const userId = await authService.googleSignupRedirect(code);

  setAuthCookies(userId, res);
  // return AppResult.redirect(`${clientHost}:${clientPort}`);
  return AppResult.redirect(`/`);
}

export default {
  signup,
  login,
  logout,
  refreshToken,
  googleLogin,
  googleLoginRedirect,
  googleSignup,
  googleSignupRedirect,
};
