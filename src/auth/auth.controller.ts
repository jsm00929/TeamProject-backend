import { NextFunction, Request, Response } from 'express';
import Jwt from 'jsonwebtoken';
import { CustomRequest } from '../types/CustomRequest';
import { authService } from './auth.service';
import { LoginBody } from './dtos/inputs/login.body';
import { SignupBody } from './dtos/inputs/signup.body';

export const authController = {
  async signup(req: CustomRequest<SignupBody>, res: Response) {
    try {
      const createUser = req.body;
      console.log(createUser);
      const createdUser = await authService.signup(createUser);
      const accessToken = Jwt.sign(
        { userId: createdUser.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
      );
      res
        .cookie('accessToken', accessToken, {
          maxAge: 7200,
          httpOnly: true,
          signed: true,
        })
        .json('가입 성공');
    } catch (error) {
      throw new Error(error);
    }
  },

  async login(req: CustomRequest<LoginBody>, res: Response) {
    const loginUser = req.body;
    console.log(loginUser);
    const loginedUser = await authService.login(loginUser);
    const accessToken = Jwt.sign(
      { userId: loginedUser.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );
    res
      .cookie('accessToken', accessToken, {
        maxAge: 7200,
        httpOnly: true,
        signed: true,
      })
      .json('로그인 성공');
  },

  async googleSignup(req: Request, res: Response) {
    const authorizationUrl = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${process.env.GOOGLE_SIGNUP_REDIRECT_URI}&response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&scope=email profile&access_type=offline`;
    res.redirect(authorizationUrl);
  },

  async googleSignupRedirect(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.query;
      const createdUser = await authService.googleSignupRedirect(code);
      console.log(createdUser);
      const accessToken = Jwt.sign(
        { userId: createdUser.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
      );
      res
        .cookie('accessToken', accessToken, {
          maxAge: 7200,
          httpOnly: true,
          signed: true,
        })
        .json('가입 성공');
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
      console.log(loginedUser);
      const accessToken = Jwt.sign(
        { userId: loginedUser.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
      );
      res
        .cookie('accessToken', accessToken, {
          maxAge: 7200,
          httpOnly: true,
          signed: true,
        })
        .json('로그인 성공');
    } catch (error) {
      throw new Error(error);
    }
  },
};
