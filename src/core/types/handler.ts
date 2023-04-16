import { NextFunction, Response } from 'express';
import { HandlerResponse } from '../middlewares';

/**
 * @description
 * Express에서 기본으로 제공하는 Handler와 같은 함수 시그니처
 * 그러나 반환 타입이 Promise<HandlerResponse | void>다.
 * 위 함수 시그니처에 따라 모든 컨트롤러에서 HandlerResponse 혹은
 * void를 반환해야 한다.
 *
 * HandlerResponse는 매우 간단한 객체로,
 * body, status 2개의 필드를 가지고 있다.
 * 이름 그대로 각 필드는 응답 시의 body, status를 설정한다.
 *
 * 만약 void가 반환되거나 HandlerResponse의 status가 undefined라면,
 * 자동으로 status가 HttpStatus.OK(200)이 설정되며,
 * void 혹은 HandlerResponse의 body가 undefined라면,
 * 자동으로 body가 빈 채로 응답을 보내게 된다.(Content-Length: 0)
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
export type Handler<R> = (
  req: R,
  res: Response,
  next: NextFunction,
) => Promise<HandlerResponse | void>;
