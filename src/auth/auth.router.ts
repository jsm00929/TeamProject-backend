import { Router } from 'express';
import { handle, handleResponse } from '../core/middlewares/handle_response';
import { SignupInput } from './dtos/inputs/signup.input';
import authController from './auth.controller';
import { LoginInput } from './dtos/inputs/login.input';

const authRouter = Router();

// authRouter.post(
//   '/signup',
//   mustValid(SignupInput),
//   handleResponse(authController.signup),
// );

authRouter.post(
  '/signup',
  handle({
    bodyCls: SignupInput,
    controller: authController.signup,
  }),
);

authRouter.post(
  '/login',
  handle({
    bodyCls: LoginInput,
    controller: authController.login,
  }),
);

authRouter.post('/logout', handleResponse(authController.logout));

authRouter.patch('/refresh-token', handleResponse(authController.refreshToken));

export default authRouter;
