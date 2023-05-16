import { RequestHandler, Request, Response, NextFunction } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ErrorMessages } from '../types/ErrorMessages';
import { AppError } from '../types/AppError';
import { CustomRequest } from '../types/CustomRequest';

export function isValid(
  cls: ClassConstructor<object>[],
  from: string[],
): RequestHandler {
  return async (
    req: CustomRequest<object>,
    res: Response,
    next: NextFunction,
  ) => {
    const obj = cls.map((c, idx) => {
      return plainToInstance(c, req[from[idx]]);
    });
    console.log(obj);
    //const obj = plainToInstance(cls, req[from]);

    // const errors = obj.map(async (o) => {
    //   await validate(o, { forbidUnknownValues: true });
    // });

    const errors = await Promise.all(
      obj.map(async (o) => {
        try {
          console.log(o);
          return validate(o, { forbidUnknownValues: true });
          return;
        } catch (error) {
          return error; // 유효성 검사에 실패한 경우 오류 객체 반환
        }
      }),
    );

    console.log(errors);
    if (errors.length > 0) {
      next(AppError.create({ message: ErrorMessages.INVALID_REQUEST_BODY }));
    }

    //새로운 변수를 추가하기 위해 req 인터페이스 확장
    obj.map((o, idx) => {
      req[from[idx]] = o;
    });
    //req[from] = obj;
    next();
  };
}
