import { isNullOrDeleted } from "../../utils/is_null_or_deleted";
import { AppError } from "../types";
import { ErrorMessages } from "../enums/error_messages";
import { HttpStatus } from "../enums/http_status";

export function isDeletableOrThrow(o: object | null) {
  if (isNullOrDeleted(o)) {
    throw AppError.new({
      message: ErrorMessages.NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }

  return true;
}
