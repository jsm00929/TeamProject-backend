import { Router } from 'express';
import { mustValid } from '../middlewares/mustValid';
import { authController } from './auth.controller';

export const authRouter = Router();

// // 로그인
// authRouter.post('/singup', authController.signup);

// // 회원가입
// authRouter.post('/login', authController.login);

// 구글 회원가입
authRouter.get('/signup/google', authController.googleSignup);

authRouter.post('/signup/google/redirect', authController.googleSignupRedirect);

// 구글 로그인
authRouter.get('/login/google', authController.googleLogin);

authRouter.post('/login/google/redirect', authController.googleLoginRedirect);
