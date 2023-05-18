import { NextFunction, Response } from "express";
import { AppResult } from "./app_result";

/**
 * @description
 * Express에서 기본으로 제공하는 Handler와 같은 함수 시그니처
 * 그러나 반환 타입이 Promise<AppResult<T> | void>다.
 * 위 함수 시그니처에 따라 모든 컨트롤러에서 AppResult<T> 혹은
 * void를 반환해야 한다.
 *
 * AppResult<T>는 매우 간단한 클래스로,
 * body, status 2개의 필드를 가지고 있다.
 * 이름 그대로 각 필드는 응답 시의 body, status를 설정한다.
 *
 * @example
 * AppResult.new({ body: T, status: HttpStatus });
 * body, status의 default 값은 null, HttpStatus.OK
 *
 * 모든 Handler 함수는 handleResponse의 첫 번째 인자로 전달되며,
 * handleResponse 내부에서 호출된다.
 * 또한 handleResponse는 handle 함수 내부에서 호출된다.
 *
 * 즉, handle -> handleResponse -> controller 순으로 호출된다.
 *
 * 직접 사용할 때는 handle 함수의 인자로 controller를 전달하면 되기 때문에,
 * handleResponse 내부 로직은 자세히 알지 못해도 된다.
 *
 * @example
 * handleResponse(controller)
 */
export type Handler<R, B = unknown> = (
  req: R,
  res: Response,
  next: NextFunction
) => Promise<AppResult<B> | void>;
