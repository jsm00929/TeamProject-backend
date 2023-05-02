import {Response} from 'express';
import {AppError} from '../types/app_error';
import {HttpStatus} from '../constants/http_status';
import {ErrorMessages} from '../constants/error_messages';
import {clearAuthCookies} from '../../utils/cookie_store';
import {log} from '../../utils/logger';

export function handleErrors(error: Error, _, res: Response, __) {
    log.debug(error);
    if (error instanceof AppError) {
        // 유효하지 않은 쿠키
        if (error.message === ErrorMessages.INVALID_TOKEN) {
            clearAuthCookies(res);
        }

        const body: Record<string, any> = {};
        if ([ErrorMessages.EXPIRED_ACCESS_TOKEN.toString(), ErrorMessages.EXPIRED_REFRESH_TOKEN.toString()].includes(error.message)) {
            body.code = -1;
        }
        body.message = error.message;

        return res.status(error.status).json(body);
    }
    log.error(error);

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: ErrorMessages.INTERNAL_SERVER_ERROR,
    });
}


// ACCESSTOKEN 만료(1시간)
// 이 사이에 만료된 ACCESSTOKEN 토큰을 /auth/refresh-token으로 보내면 ACCESSTOKEN을 재발급 받는다.
// ACCESSTOKEN COOKIE 삭제(2시간)