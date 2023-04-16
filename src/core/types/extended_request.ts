import {
  AuthRequest,
  AuthRequestWith,
  OptionalAuthRequest,
  OptionalAuthRequestWith,
  RequestWith,
} from './request_with';

/**
 * handle의 authLevel 필드의 타입으로,
 * none인 경우 로그인 검증 X
 * optional은 로그인 검증은 하지만 비로그인도 사용 가능
 * must는 비로그인 시 오류를 발생시키도록 구성되어 있다.
 *
 * 해당 로직은 isAuth, mustAuth 등의 middleware에서 처리되며,
 * 해당 middleware는 handle 함수에서 handlers 배열로 추가되며,
 * 특정 path에 해당되는 express의 middleware 체인으로 반환되어 등록된다.
 *
 * 물론 handle 함수를 거치지 않고 아래와 같이 middleware을 직접 등록하여 사용할 수도 있다.
 * @example
 * usersRouter.get('/', isAuth, controller);
 *
 * @description
 * handle 함수를 거친다면 아래와 같이 옵션으로 'must' | 'optional' | 'none' 중
 * 한가지를 인자로 전달하면 isAuth, mustAuth 등을 옵션에 따라 자동으로 호출 및 검증한다.
 *
 * @example
 * handle({
 *      authLevel: 'must',
 *      controller: controller,
 * });
 */
export type AuthLevel = 'none' | 'optional' | 'must';

export type ExtendedRequest<A, I, P> = A extends 'must'
  ? ConditionalAuthRequest<I, P>
  : A extends 'optional'
  ? ConditionalOptionalAuthRequest<I, P>
  : ConditionalRequest<I, P>;

type ConditionalAuthRequest<I, P> = I extends unknown
  ? P extends unknown
    ? AuthRequestWith<I, P>
    : AuthRequestWith<I>
  : P extends unknown
  ? AuthRequestWith<never, P>
  : AuthRequest;

type ConditionalOptionalAuthRequest<I, P> = I extends unknown
  ? P extends unknown
    ? OptionalAuthRequestWith<I, P>
    : OptionalAuthRequestWith<I>
  : P extends unknown
  ? OptionalAuthRequestWith<never, P>
  : OptionalAuthRequest;

type ConditionalRequest<I, P> = I extends unknown
  ? P extends unknown
    ? RequestWith<I, P>
    : RequestWith<I>
  : P extends unknown
  ? RequestWith<never, P>
  : Request;
