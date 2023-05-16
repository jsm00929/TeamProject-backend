import { AppError } from '../../types/AppError';
import { ErrorMessages } from '../../types/ErrorMessages';
import { HttpStatus } from '../../types/HttpStatus';

// 이미 로그인 된 상태에서 로그인 요청
export function checkLoginStatus(req, res, next) {
  if (req.cookie.accessToken) {
    throw AppError.create({
      message: ErrorMessages.ALREADY_LOGINED,
      status: HttpStatus.BAD_REQUEST,
    });
  }
}
