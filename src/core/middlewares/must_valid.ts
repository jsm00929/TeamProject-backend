import { ClassConstructor } from 'class-transformer';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction } from 'express';
import { RequestWith } from '../types/request_with';
import { AppError } from '../types/app_error';
import { ErrorMessages } from '../constants/error_messages';
import { parseIntProps } from '../../utils/parser/parse_int_props';

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
export function mustValidBody<I>(cls: ClassConstructor<I>) {
  return async (req: RequestWith<I>, _, next: NextFunction) => {
    const body = plainToClass(cls, req.body);

    const errors = await validate(body as object);
    if (errors.length > 0) {
      return next(
        AppError.new({
          message: ErrorMessages.INVALID_REQUEST_BODY,
        }),
      );
    }

    req.unwrap = () => body;
    next();
  };
}

export function mustValidQuery<Q>(cls: ClassConstructor<Q>) {
  return async (req: RequestWith<Q>, _, next: NextFunction) => {
    const query = plainToClass(cls, parseIntProps(req.query));

    const errors = await validate(query as object);
    if (errors.length > 0) {
      return next(
        AppError.new({
          message: ErrorMessages.INVALID_REQUEST_BODY,
        }),
      );
    }

    req.unwrap = () => query;
    next();
  };
}

export function mustValidParams<P>(cls: ClassConstructor<P>) {
  return async (req: RequestWith<never, P>, _, next: NextFunction) => {
    const params = plainToClass(cls, parseIntProps(req.params));

    const errors = await validate(params as object);
    if (errors.length > 0) {
      return next(
        AppError.new({
          message: ErrorMessages.INVALID_REQUEST_PARAMS,
        }),
      );
    }

    req.unwrapParams = () => params;
    next();
  };
}

// export function _mustValid<T, P>(
//   inputClass: ClassConstructor<T>,
//   paramsClass: ClassConstructor<P>,
//   kind: 'body' | 'query',
// ) {
//   return async (req: RequestWith<T, P>, _, next: NextFunction) => {
//     let input: T;
//     let params: P;

//     if (kind === 'body') {
//       input = plainToClass(inputClass, req.body);
//     } else if (kind === 'query') {
//       input = plainToClass(inputClass, parseIntProps(req.query));
//     }
//     if (paramsClass !== null) {
//       params = plainToClass(paramsClass, parseIntProps(req.params));
//     }

//     const inputErrors = await validate(input as object);
//     if (inputErrors.length > 0) {
//       return next(
//         AppError.new({
//           message:
//             kind === 'body'
//               ? ErrorMessages.INVALID_REQUEST_BODY
//               : ErrorMessages.INVALID_REQUEST_QUERY,
//         }),
//       );
//     }

//     const paramsErrors = await validate(params as object);
//     if (paramsErrors.length > 0) {
//       return next(
//         AppError.new({
//           message: ErrorMessages.INVALID_REQUEST_PARAMS,
//         }),
//       );
//     }

//     req.unwrap = () => input;
//     req.unwrapParams = () => params;

//     next();
//   };
// }
