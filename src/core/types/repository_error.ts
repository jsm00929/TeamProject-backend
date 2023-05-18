import { HttpStatus } from "../enums/http_status";
import { Into } from "./into";
import { AppError } from "./app_error";
import { ErrorMessages } from "../constants";
import { RepositoryErrorKind } from "../enums/repository_error_kind";
import { RepositoryKind } from "../enums/repository_kind";

interface RepositoryErrorArgs {
  repositoryKind: RepositoryKind;
  errorKind: RepositoryErrorKind;
}

export class RepositoryError extends Error implements Into<AppError> {
  repositoryKind: RepositoryKind;
  errorKind: RepositoryErrorKind;

  private constructor({ repositoryKind, errorKind }: RepositoryErrorArgs) {
    const message = `DB ERROR at ${repositoryKind},
        ERROR KIND: ${errorKind}`;
    super(message);
    this.repositoryKind = repositoryKind;
    this.errorKind = errorKind;
  }

  public static new(args: RepositoryErrorArgs) {
    return new this(args);
  }

  public into(): AppError {
    if (this.errorKind === RepositoryErrorKind.NOT_FOUND_ERROR) {
      return AppError.new({
        message: ErrorMessages.NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return AppError.new({
      message: ErrorMessages.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
