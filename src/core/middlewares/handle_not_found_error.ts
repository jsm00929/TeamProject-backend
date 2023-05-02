import {Response} from 'express';
import {ErrorMessages, HttpStatus} from '../constants';

export function handleNotFoundError(_, res: Response) {
    res.status(HttpStatus.NOT_FOUND).json({
        message: ErrorMessages.NOT_FOUND_ENDPOINT,
    });
}
