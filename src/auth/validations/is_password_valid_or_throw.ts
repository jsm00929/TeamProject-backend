import { AppError } from "../../core/types";
import { ErrorMessages } from "../../core/enums/error_messages";
import { HttpStatus } from "../../core/enums/http_status";
import { comparePassword } from "../../utils/hash";

export async function isPasswordValidOrThrow(
  password: string | undefined | null,
  hashedPassword: string | null
) {
  // 1. 비밀번호 미설정 계정은 OK
  if (hashedPassword === null) {
    return;
  }

  // 2. 아니면 검증
  if (password !== undefined && password !== null) {
    const isMatchedPassword = await comparePassword(password!, hashedPassword);
    if (isMatchedPassword) {
      return;
    }
  }

  throw AppError.new({
    message: ErrorMessages.INVALID_PASSWORD,
    status: HttpStatus.UNAUTHORIZED,
  });
}
