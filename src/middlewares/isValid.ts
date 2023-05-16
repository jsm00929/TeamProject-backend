import { RequestHandler, Request, Response, NextFunction } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ErrorMessages } from '../types/ErrorMessages';
import { AppError } from '../types/AppError';
import { CustomRequest } from '../types/CustomRequest';

export function isValid(
  cls: ClassConstructor<object>,
  from: string,
): RequestHandler {
  return async (
    req: CustomRequest<object>,
    res: Response,
    next: NextFunction,
  ) => {
    const obj = plainToInstance(cls, req[from]);

    console.log(obj);
    const errors = await validate(obj);
    if (errors.length > 0) {
      next(AppError.create({ message: ErrorMessages.INVALID_REQUEST_BODY }));
    }

    //새로운 변수를 추가하기 위해 req 인터페이스 확장
    req[from] = obj;
    next();
  };
}
