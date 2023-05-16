import { NextFunction, Request, Response } from 'express';
import Jwt from 'jsonwebtoken';
import { CustomRequest } from '../types/CustomRequest';
import { authService } from './auth.service';
import { LoginBody } from './dtos/inputs/login.body';
import { SignupBody } from './dtos/inputs/signup.body';
import {
  GOOGLE_SIGNUP_AUTH_URI,
  GOOGLE_LOGIN_AUTH_URL,
} from '../config/constants';
import {
  generateAccessToken,
  setAccessTokenCookie,
  verifyRefreshToken,
} from '../utils/aboutToken';
import { GoogleLoginCodeQuery } from './dtos/inputs/google_login_code.query';
import { AppError } from '../types/AppError';
import { ErrorMessages } from '../types/ErrorMessages';
import { HttpStatus } from '../types/HttpStatus';

export const authController = {
  async signup(
    req: CustomRequest<SignupBody>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const createUser = req.body;
      const createdUser = await authService.signup(createUser);

      const accessToken = generateAccessToken({
        userId: createdUser.id,
        username: createdUser.name,
      });

      setAccessTokenCookie('accessToken', accessToken, res);
      res.json('가입 성공');
    } catch (error) {
      next(error);
    }
  },

  async login(
    req: CustomRequest<LoginBody>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const loginUser = req.body;

      const loginedUser = await authService.login(loginUser);
      const accessToken = generateAccessToken({
        userId: loginedUser.id,
        username: loginedUser.name,
      });

      setAccessTokenCookie('accessToken', accessToken, res);
      res.json('로그인 성공');
    } catch (error) {
      next(error);
    }
  },

  // oAuth
  async googleSignup(req: Request, res: Response) {
    const authorizationUrl = GOOGLE_SIGNUP_AUTH_URI;
    res.redirect(authorizationUrl);
  },

  async googleSignupRedirect(
    req: CustomRequest<GoogleLoginCodeQuery>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { code } = req.query;
      const createdUser = await authService.googleSignupRedirect(code);

      const accessToken = generateAccessToken({
        userId: createdUser.id,
        username: createdUser.name,
      });

      setAccessTokenCookie('accessToken', accessToken, res);
      res.json('구글 회원가입 성공');
    } catch (error) {
      next(error);
    }
  },

  async googleLogin(req: Request, res: Response) {
    const authorizationUrl = GOOGLE_LOGIN_AUTH_URL;
    res.redirect(authorizationUrl);
  },

  async googleLoginRedirect(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.query;
      const loginedUser = await authService.googleLoginRedirect(code);

      const accessToken = generateAccessToken({
        userId: loginedUser.id,
        username: loginedUser.name,
      });

      setAccessTokenCookie('accessToken', accessToken, res);
      res.json('로그인 성공');
    } catch (error) {
      next(error);
    }
  },

  async reissuanceToken(req, res, next) {
    const { refreshToken } = req.cookie;

    const payload = verifyRefreshToken(refreshToken);
    const accessToken = generateAccessToken({
      userId: payload.id,
      username: payload.name,
    });
    setAccessTokenCookie('accessToken', accessToken, res);
    res.json('accessToken 재발급 성공');
  },
};
