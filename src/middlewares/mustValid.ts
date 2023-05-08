import { ClassConstructor } from 'class-transformer';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction } from 'express';
import { RequestWith } from '../types/RequestWith';
import { AppError } from '../types/AppError';
import { HttpStatus } from '../types/HttpStatus';
import { ErrorMessages } from '../types/ErrorMessages';

/**
 *
 * @param cls: request body로 바인딩 할 dto의 타입(class)
 * @returns middleware로 사용할 handler
 * @description
 * 인자로 전달한 dto의 decorator에 따라 request body가 validate 됨.
 * validation 실패 시, handleErrors로 처리가 넘어가며,
 * 성공 시, Express Request에 unwrap 메소드가 추가됨.
 *
 * request body가 validate 된 이후 plain object가 class object로 변환되는데,
 * unwrap을 통해 이 변환된 class object(dto)를 다음 handler에서 획득할 수 있음
 * 단, handler의 첫 번째 인자인 req의 타입을 Express Request가 아닌
 * RequestWith<dto 타입명>로 명시해야 함.
 */
export function mustValid<T>(cls: ClassConstructor<T>) {
  return async (req: RequestWith<T>, _, next: NextFunction) => {
    console.log('valid start');
    const dto = plainToClass(cls, req.body);
    const errors = await validate(dto as object);
    if (errors.length > 0) {
      console.log(errors);
      next(
        AppError.create({
          message: ErrorMessages.INVALID_REQUEST_BODY,
        }),
      );
      return;
    }
    req.unwrap = () => dto;
    next();
  };
}
