import { Request, Response } from 'express';
import { RequestWith } from '../core/types/request_with';
import { SignupInput } from './dtos/inputs/signup.input';
import authService from './auth.service';
import { HttpStatus } from '../core/constants/http_status';
import { HandlerResponse } from '../core/middlewares/handle_response';
import { LoginInput } from './dtos/inputs/login.input';
import {
  clearAuthCookies,
  setAccessTokenCookie,
  setAuthCookies,
} from '../utils/cookie/cookie_store';
import { REFRESH_TOKEN_COOKIE_NAME } from '../config/constants';
import { verifyRefreshToken } from '../utils/token/token';

async function signup(
  req: RequestWith<SignupInput>,
  res: Response,
): Promise<HandlerResponse> {
  const signupInput = req.unwrap();
  const signupOutput = await authService.signUp(signupInput);

  setAuthCookies(signupOutput.userId, res);

  return {
    body: signupOutput,
    status: HttpStatus.CREATED,
  };
}

async function login(req: RequestWith<LoginInput>, res: Response) {
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
