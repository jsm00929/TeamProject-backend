import {Response} from 'express';
import {AppError} from '../types';
import {ErrorMessages, HttpStatus} from '../constants';
import {clearAuthCookies} from '../../utils/cookie_store';
import {log} from '../../utils/logger';

const {
    EXPIRED_REFRESH_TOKEN,
    INVALID_TOKEN,
    INTERNAL_SERVER_ERROR,
    EXPIRED_ACCESS_TOKEN,
} = ErrorMessages;

export function handleErrors(error: Error, _, res: Response, __) {
    log.debug(error);


    if (error instanceof AppError) {
        // 유효하지 않은 쿠키
        if (error.message === INVALID_TOKEN) {
            clearAuthCookies(res);
        }

        const body: Record<string, string | number> = {};
        if (
            [
                EXPIRED_ACCESS_TOKEN.toString(),
                EXPIRED_REFRESH_TOKEN.toString()
            ]
                .includes(error.message)) {
            body.code = -1;
        }
        body.message = error.message;

        return res.status(error.status).json(body);
    }

    log.error(error);

    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
            message: INTERNAL_SERVER_ERROR,
        });
}

