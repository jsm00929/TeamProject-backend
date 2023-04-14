import { HttpStatus } from './HttpStatus';

export class AppError extends Error {
  status: HttpStatus;

  private constructor(message: string, status: HttpStatus) {
    super(message);
    this.status = status;
  }

  /**
   * @description status 생략 가능, default = 400 BAD_REQUEST
   */
  static create({
    message,
    status = HttpStatus.BAD_REQUEST,
  }: {
    message: string;
    status?: HttpStatus;
  }) {
    return new this(message, status);
  }
}
