import { HttpStatus } from '../constants';

interface AppResultArgs<T> {
  body?: T;
  status?: HttpStatus;
}
export class AppResult<T> {
  body: T | undefined;
  status: HttpStatus;

  static default<T = unknown>() {
    const appResult = new AppResult<T>();
    appResult.status = HttpStatus.OK;
    return appResult;
  }

  static new<T>({ body, status }: AppResultArgs<T>) {
    const appResult = AppResult.default<T>();
    if (body) {
      appResult.body = body;
    }
    if (status) {
      appResult.status = status;
    }

    return appResult;
  }
}
