import { Router } from 'express';
import { handleResponse } from '../core/middlewares/handle_response';
import { SignupBody } from './dtos/inputs/signup.body';
import authController from './auth.controller';
import { LoginBody } from './dtos/inputs/login.body';
import { handle } from '../core/handle';
import { mustAuth } from './middlewares/must_auth';

const authRouter = Router();

/**
 * @description
 * 회원 가입
 */
authRouter.post(
  '/signup',
  handle({
    bodyCls: SignupBody,
    controller: authController.signup,
  }),
);

/**
 * @description
 * 로그인
 */
authRouter.post(
  '/login',
  handle({
    bodyCls: LoginBody,
    controller: authController.login,
  }),
);

/**
 * @description
 * 로그아웃
 */
authRouter.post('/logout', handleResponse(authController.logout));

/**
 * @description
 * AccessToken 재발급
 */
authRouter.patch('/refresh-token', handleResponse(authController.refreshToken));

export default authRouter;
