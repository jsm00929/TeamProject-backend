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
  async signup(req: CustomRequest<SignupBody>, res: Response) {
    try {
      const createUser = req.body;
      console.log(createUser);
      const createdUser = await authService.signup(createUser);

      const accessToken = generateAccessToken({
        userId: createdUser.id,
        username: createdUser.name,
      });

      setAccessTokenCookie('accessToken', accessToken, res);
      res.json('가입 성공');
    } catch (error) {
      throw new Error(error);
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

  async googleSignup(req: Request, res: Response) {
    const authorizationUrl = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${process.env.GOOGLE_SIGNUP_REDIRECT_URI}&response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&scope=email profile&access_type=offline`;
    res.redirect(authorizationUrl);
  },

  async googleSignupRedirect(req: Request, res: Response, next: NextFunction) {
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
      throw new Error(error);
    }
  },

  async googleLogin(req: Request, res: Response) {
    const authorizationUrl = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${process.env.GOOGLE_LOGIN_REDIRECT_URI}&response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&scope=email profile&access_type=offline`;
    res.redirect(authorizationUrl);
  },

  async googleLoginRedirect(req: Request, res: Response) {
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
      throw new Error(error);
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
