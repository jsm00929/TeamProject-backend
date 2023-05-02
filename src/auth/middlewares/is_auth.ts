import {NextFunction, Response} from 'express';
import {ACCESS_TOKEN_COOKIE_NAME} from '../../config/constants';
import {verifyAccessToken} from '../../utils/token';
import {AppError, OptionalAuthRequest} from '../../core/types';
import {ErrorMessages, HttpStatus} from "../../core/constants";

export function isAuth(req: OptionalAuthRequest, res: Response, next: NextFunction) {
    const accessToken = req.signedCookies[ACCESS_TOKEN_COOKIE_NAME];

    // TODO: signedCookies는 미들웨어를 거쳐서 온 것이므로 쿠키를 조작한 경우에는 false가 나온다.
    // 쿠키를 임의로 조작한 경우 쪼까냄
    if (accessToken === false) {
        throw AppError.new({message: ErrorMessages.INVALID_TOKEN, status: HttpStatus.UNAUTHORIZED})
    }

    // accessToken이 있는 경우
    if (accessToken) {
        try {
            req.userId = verifyAccessToken(accessToken);
        } catch (e) {
            // 유효하지 않거나 만료된 토큰일 경우 쿠키를 지우고 에러를 던진다.
            return next(e);
        }
    }
    next();
}
