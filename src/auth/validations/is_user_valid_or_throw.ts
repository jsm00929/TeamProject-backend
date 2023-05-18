import { AppError } from "../../core/types";
import { ErrorMessages } from "../../core/enums/error_messages";
import { HttpStatus } from "../../core/enums/http_status";
import { isNullOrDeleted } from "../../utils/is_null_or_deleted";

export function isUserValidOrThrow(user) {
  if (isNullOrDeleted(user)) {
    throw AppError.new({
      message: ErrorMessages.USER_NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }
}
