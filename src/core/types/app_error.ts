import { HttpStatus } from '../constants/http_status';

interface AppErrorArgs {
  message: string;
  status?: HttpStatus;
}

export class AppError extends Error {
  status: HttpStatus;
  code?: number;

  private constructor(message: string, status: HttpStatus) {
    super(message);
    this.status = status;
  }

  /**
   * @description status 생략 가능, default = 400 BAD_REQUEST
   * @example
   * const someError = AppError.new({
   *    message: '뭔가 이상해요. 오류 났음',
   *    status: HttpStatus.BAD_REQUEST,
   * });
   *
   * throw someError;
   */
  static new({ message, status = HttpStatus.BAD_REQUEST }: AppErrorArgs) {
    return new this(message, status);
  }

  static newWithCode({ message, status = HttpStatus.BAD_REQUEST ,code }: AppErrorArgs & { code: number }) {
    const n = new this(message, status);
    n.code = code;
    return n;
  }
}
