import { NextFunction, Response, RequestHandler } from 'express';
import Jwt from 'jsonwebtoken';
import { RequestWith } from '../types/RequestWith';
import { authService } from './auth.service';
import { GoogleLoginCodeQuery } from './dtos/inputs/google_login_code.query';
import { LoginBody } from './dtos/inputs/login.body';
import { SignupBody } from './dtos/inputs/signup.body';

export const authController = {
  // async singup(
  //   req: RequestWith<SignupBody>,
  //   res: Response,
  //   next: NextFunction,
  // ) {
  //   const createUser = req.unwrap();
  //   console.log(createUser);
  //   const createdUser = await authService.signup();
  //   res.json(createdUser);
  // },

  // async login(req: RequestWith<LoginBody>, res: Response) {

  // },
  //https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?redirect_uri=https%3A%2F%2Fdevelopers.google.com%2Foauthplayground&prompt=consent&response_type=code&client_id=407408718192.apps.googleusercontent.com&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&access_type=offline&service=lso&o2v=2&flowName=GeneralOAuthFlow
  //https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=https%3A%2F%2Fdevelopers.google.com%2Foauthplayground&prompt=consent&response_type=code&client_id=407408718192.apps.googleusercontent.com&scope=&access_type=offline
  //oauth 로그인
  //1. authorization 서버에 로그인 요청
  //2. authorization 서버가 인가해주고 토큰 발급을 위한 code를 redirect url에 반환
  //3. 요청받은 redirect에서 code로 리소스 서버에서 토큰 발급
  //4. 토큰반환해서 로그인 완료

  async googleSignup(req: RequestWith<Request>, res: Response) {
    //const authorizationUrl = await authService.googleSignup();
    const authorizationUrl = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${process.env.GOOGLE_SIGNUP_REDIRECT_URI}&response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&scope=email profile`;
    res.writeHead(302, { Location: authorizationUrl });
  },

  async googleSignupRedirect(
    req: RequestWith<GoogleLoginCodeQuery>,
    res: Response,
  ) {
    const { code } = req.unwrap();
    const createdUser = await authService.googleSignupRedirect(code);
    const accessToken = Jwt.sign(
      { userId: createdUser.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );
    res.cookie('accessToken', accessToken, {
      maxAge: 7200,
      httpOnly: true,
      signed: true,
    });
  },

  async googleLogin(req: RequestWith<Request>, res: Response) {
    const uri =
      `https://api.solapi.net/oauth2/v1/authorize?` +
      `client_id=${process.env.GOOGLE_CLIENT_ID}` +
      `redirect_uri=${process.env.GOOGLE_LOGIN_REDIRECT_URI}&` +
      `response_type=code&` +
      `scope=message:write`;
    return res.redirect(uri);
  },

  async googleLoginRedirect(
    req: RequestWith<GoogleLoginCodeQuery>,
    res: Response,
  ) {
    const { code } = req.unwrap();
  },
};
