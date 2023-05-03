import {HttpStatus} from '../constants';

interface AppResultArgs<T> {
    body?: T;
    status?: HttpStatus;
    redirectUrl?: string;
}

export class AppResult<T> {
    body?: T;
    status: HttpStatus;
    redirectUrl?: string;

    static default<T = unknown>() {
        const appResult = new AppResult<T>();
        appResult.status = HttpStatus.OK;
        return appResult;
    }

    static new<T>({body, status}: AppResultArgs<T>) {
        const appResult = AppResult.default<T>();
        if (body) {
            appResult.body = body;
        }
        if (status) {
            appResult.status = status;
        }

        return appResult;
    }

    static redirect(url: string) {
        const appResult = new AppResult();
        appResult.status = HttpStatus.FOUND;
        appResult.redirectUrl = url;
        return appResult;
    }
}
