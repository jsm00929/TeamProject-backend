// import {Router} from 'express';
// import {SignupBody} from './dtos/inputs/signup.body';
// import authController from './auth.controller';
// import {LoginBody} from './dtos/inputs/login.body';
// import {handle} from '../core/handle';
// import {GoogleLoginCodeQuery} from './dtos/inputs/google_login_code.query';
//
// const authRouter = Router();
//
// /**
//  * @description
//  * 회원 가입
//  */
// authRouter.post(
//     '/signup',
//     handle({
//         bodyCls: SignupBody,
//         controller: authController.signup,
//     }),
// );
//
// /**
//  * @description
//  * 로그인
//  */
// authRouter.post(
//     '/login',
//     handle({
//         bodyCls: LoginBody,
//         controller: authController.login,
//     }),
// );
//
// /**
//  * @description
//  * 로그아웃
//  */
// authRouter.post('/logout', handle({controller: authController.logout}));
//
// /**
//  * @description
//  * AccessToken 재발급
//  */
// authRouter.patch(
//     '/refresh-token',
//     handle({controller: authController.refreshToken}),
// );
//
// /**
//  * @description
//  * Google Login
//  */
// authRouter.get(
//     '/signup/google',
//     handle({controller: authController.googleSignup}),
// );
// authRouter.get(
//     '/signup/google/redirect',
//     handle({
//         queryCls: GoogleLoginCodeQuery,
//         controller: authController.googleSignupRedirect,
//     }),
// );
// authRouter.get(
//     '/login/google',
//     handle({
//         controller: authController.googleLogin,
//     }),
// );
// authRouter.get(
//     '/login/google/redirect',
//     handle({
//         queryCls: GoogleLoginCodeQuery,
//         controller: authController.googleLoginRedirect,
//     }),
// );
//
// export default authRouter;
