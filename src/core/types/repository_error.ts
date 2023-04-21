import { HttpStatus } from '../constants';

interface RepositoryErrorArgs {
  message: string;
  query: string;
}

export class RepositoryError extends Error {
  status: HttpStatus;

  private constructor(message: string) {
    super(message);
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
  static new({ message }: RepositoryErrorArgs) {
    return new this(message);
  }
}
