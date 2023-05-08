import { RequestHandler, Request, Response, NextFunction } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ErrorMessages } from '../../types/ErrorMessages';
import { AppError } from '../../types/AppError';
import { RequestWith } from '../../types/RequestWith';
import { CustomRequest } from '../../types/CustomRequest';

export function isValid(cls: ClassConstructor<object>): RequestHandler {
  return async (
    req: CustomRequest<object>,
    res: Response,
    next: NextFunction,
  ) => {
    const obj = plainToInstance(cls, req.body);

    const errors = await validate(obj, { forbidUnknownValues: true });
    if (errors.length > 0) {
      next(AppError.create({ message: ErrorMessages.INVALID_REQUEST_BODY }));
    }

    //새로운 변수를 추가하기 위해 req 인터페이스 확장
    req.body = obj;
    console.log(typeof req.body);
    next();
  };
}
