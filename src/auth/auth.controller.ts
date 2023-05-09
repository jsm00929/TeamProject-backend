import {Request, Response, Router} from 'express';
import {AppError, RequestWith} from '../core/types';
import {SignupBody} from './dtos/inputs/signup.body';
import authService from './auth.service';
import {ErrorMessages, HttpStatus} from '../core/constants';
import {LoginBody} from './dtos/inputs/login.body';
import {clearAuthCookies, setAccessTokenCookie, setAuthCookies,} from '../utils/cookie_store';
import {GOOGLE_LOGIN_OAUTH2_URL, GOOGLE_SIGNUP_OAUTH2_URL, REFRESH_TOKEN_COOKIE_NAME,} from '../config/constants';
import {verifyRefreshToken} from '../utils/token';
import {AppResult} from '../core/types/app_result';
import {GoogleLoginCodeQuery} from './dtos/inputs/google_login_code.query';
import {Config} from '../config/env';
import {handle} from "../core/handle";

const {clientHost, clientPort} = Config.env;

export const authRouter = Router();

/**
 * @description
 * 회원 가입
 */
authRouter.post(
    '/signup',
    handle({
        bodyCls: SignupBody,
        controller: signup,
    }),
);

async function signup(req: RequestWith<SignupBody>, res: Response) {
    const signupInput = req.unwrap();
    const userId = await authService.signUp(signupInput);

    setAuthCookies(userId, res);

    return AppResult.new({
        status: HttpStatus.CREATED,
    });
}

/**
 * @description
 * 로그인
 */
authRouter.post(
    '/login',
    handle({
        bodyCls: LoginBody,
        controller: login,
    }),
);

async function login(req: RequestWith<LoginBody>, res: Response) {
    const {email, password} = req.unwrap();
    const userId = await authService.login({email, password});

    setAuthCookies(userId, res);
}

/**
 * @description
 * 로그아웃
 */
authRouter.post('/logout',
    handle({
        controller: logout,
    }));

async function logout(_, res: Response) {
    clearAuthCookies(res);
}

/**
 * @description
 * AccessToken 재발급
 */
authRouter.patch(
    '/refresh-token',
    handle({
        controller: refreshToken
    }));

async function refreshToken(req: Request, res: Response) {
    const token = req.signedCookies[REFRESH_TOKEN_COOKIE_NAME];

    if (token === false || typeof token !== 'string') {
        throw AppError.new({
            message: ErrorMessages.INVALID_TOKEN,
            status: HttpStatus.UNAUTHORIZED,
        });
    }
    const userId = verifyRefreshToken(token);

    setAccessTokenCookie(userId, res);
}

/**
 * @description
 * Google Signup
 */
authRouter.get(
    '/signup/google',
    handle({
        controller: googleSignup
    }));

async function googleSignup(req: Request, res: Response) {
    res.redirect(GOOGLE_SIGNUP_OAUTH2_URL);
}

/**
 * @description
 * Google Login
 */
authRouter.get(
    '/login/google',
    handle({
        controller: googleLogin
    }));


async function googleLogin(req: Request, res: Response) {
    res.redirect(GOOGLE_LOGIN_OAUTH2_URL);
}

/**
 * @description
 * Google Login Redirect
 */
authRouter.get(
    '/login/google/redirect',
    handle({
        queryCls: GoogleLoginCodeQuery,
        controller: googleLoginRedirect,
    }),
);

async function googleLoginRedirect(
    req: RequestWith<GoogleLoginCodeQuery>,
    res: Response,
) {
    const {code} = req.unwrap();
    try {
        const userId = await authService.googleLoginRedirect(code);

        setAuthCookies(userId, res);
        // return AppResult.redirect(`${clientHost}:${clientPort}`);
    } catch (e) {
        // TODO: 구글 로그인 실패 시, REDIRECT URL
        return AppResult.redirect(`http://${clientHost}:${clientPort}/`);
    }
    // 성공시
    return AppResult.redirect(`http://${clientHost}:${clientPort}/`);
}

/**
 * @description
 * Google Signup Redirect
 */
authRouter.get(
    '/signup/google/redirect',
    handle({
        queryCls: GoogleLoginCodeQuery,
        controller: googleSignupRedirect,
    }),
);


async function googleSignupRedirect(
    req: RequestWith<GoogleLoginCodeQuery>,
    res: Response,
) {
    const {code} = req.unwrap();
    try {
        const userId = await authService.googleSignupRedirect(code);
        setAuthCookies(userId, res);
    } catch (e) {
        // TODO: 구글 로그인 실패 시, REDIRECT URL
        return AppResult.redirect(`http://${clientHost}:${clientPort}/`);
    }
    // 성공시
    return AppResult.redirect(`http://${clientHost}:${clientPort}/`);
}


// RTR 1회용 리프레시 토큰
// 1. 로그인 -> accessToken 쿠키 발급, refreshToken Redis 저장-> key: accessToken?, value: refreshToken
// 2. accessToken 만료-> accessToken 서버에 보내서 refresh
// 이 때, RTR 방식이기 때문에 기존 refresh Token이 '있으면' 발급 후 삭제
// 3. accessToken 발급 및 refreshToken 새로 저장
