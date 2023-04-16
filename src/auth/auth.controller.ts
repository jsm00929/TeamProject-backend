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
} from '../utils/cookie/cookie_store';
import { REFRESH_TOKEN_COOKIE_NAME } from '../config/constants';
import { verifyRefreshToken } from '../utils/token/token';
import { AppResult } from '../core/types/app_result';

async function signup(req: RequestWith<SignupBody>, res: Response) {
  const signupInput = req.unwrap();
  const signupOutput = await authService.signUp(signupInput);

  setAuthCookies(signupOutput.userId, res);

  return AppResult.new({
    body: signupOutput,
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
  const userId = verifyRefreshToken(token);

  setAccessTokenCookie(userId, res);
}

export default {
  signup,
  login,
  logout,
  refreshToken,
};
