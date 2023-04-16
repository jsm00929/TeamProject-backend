import { Request } from 'express';

/**
 * @description
  로그인, 비로그인 사용자 모두 이용 가능하지만,
  로그인 여부에 따라 동작이 달라지는 서비스일 경우에 사용
  userId는 로그인 된 사용자의 userId를 AccessToken으로부터 추출한 것
  컨트롤러에서 isAuth 미들웨어로 검증한 이후 Request의 타입으로 사용할 것
 */
export interface OptionalAuthRequest extends Request {
  userId?: number;
}

/**
 * @description
  반드시 로그인 해야만 이용 가능한 서비스일 경우에 사용
  userId는 로그인 된 사용자의 userId를 AccessToken으로부터 추출한 것
  로그인 하지 않은 사용자는 해당 서비스에 접근할 수 없으며,
  컨트롤러에서 mustAuth 미들웨어로 검증한 이후 Request의 타입으로 사용할 것
 */
export interface AuthRequest extends Request {
  userId: number;
}

/**
 * @description
 * 사용자가 request body에 입력한 값이 유효한지
 * handler 호출 전에 mustValid로 검증한 뒤,
 * 유효하지 않으면 오류가 발생하여 handlerErrors로 넘어갈 것이고,
 * 유효하다면 Express의 Request에 입력된 input dto의 instance를 만들어
 * req.unwrap() 메소드로 다음 미들웨어에서 언제든 추출할 수 있도록 바인딩한다.
 * 그러나 기본적으로 Express의 Request interface에는
 * unwrap 메소드가 존재하지 않기 때문에 타입을 일치시키기 위해
 * 해당 인터페이스를 extends로 확장한 것
 *
 * request query를 검증하는 것도 가능한데,
 * 이 때는 handler 호출 전에 mustValidQuery로 검증 필요
 * 마찬가지로 req.unwrap() 메소드로 검증된 값의 dto가 들어 있는 instance 획득 가능
 *
 * body, query를 첫 번째 type parameter인 I로 지정할 수 있으며,(input)
 * P는 path parameter를 나타냄
 * body, query와 함께 path parameter를 사용해야 하는 경우가 있기 때문에
 * 두 번째 type parameter를 P로 지정해서 동시 사용 가능
 * 이 때는 req.unwrapParams()로 바인딩 된 dto를 얻을 수 있으며,
 * path parameter는 기본적으로 never로 설정되어 있음
 *
 * 따라서 path parameter를 사용하지 않는 경우는 첫 번째 type parameter만 지정
 */
export interface RequestWith<I, P = never> extends Request {
  /**
   *
   * @returns 바인딩 된 input dto의 instance
   * @description 사용자가 request body에 입력한 값을 middleware에서 검증한 뒤,
   * 오류가 없다면 이 메소드를 통해 해당 body와 일치하는 dto 타입의 instance를 받아서 사용할 수 있다.
   */
  unwrap: () => I;

  /**
   *
   * @returns 바인딩 된 path parameter dto의 instance
   * @description 사용자가 path parameter로 입력한 값을 middleware에서 검증한 뒤,
   * 오류가 없다면 이 메소드를 통해 해당 path parameter와 일치하는 dto 타입의 instance를 받아서 사용할 수 있다.
   */
  unwrapParams: () => P;
}

/**
 * @description
  OptionalAuthRequest의 확장 타입으로, request body 혹은 query는
  type parameter I로, path parameter는 P로 받는다.
  body와 query를 묶어서 input으로 명명하고,
  body와 params 동시에 받아서 사용하는 것도 가능하며,
  기본적으로 body는 반드시 명시를 해줘야 하지만, params는 생략 시, never이 default다.
  @example
  OptionalAuthRequestWith<InputType> // input 단독 사용 시
  @example
  OptionalAuthRequestWith<never, PathType> // params 단독 사용 시
  @example
  OptionalAuthRequestWith<InputType, PathType> // input, params 동시 사용
 */
export interface OptionalAuthRequestWith<I, P = never>
  extends RequestWith<I, P>,
    OptionalAuthRequest {}

/**
 * @description
  AuthRequest의 확장 타입으로, request body 혹은 query는
  type parameter I로, path parameter는 P로 받는다.
  body와 query를 묶어서 input으로 명명하고,
  body와 params 동시에 받아서 사용하는 것도 가능하며,
  기본적으로 body는 반드시 명시를 해줘야 하지만, params는 생략 시, never이 default다.
  @example
  async function controller(req: AuthRequestWith<InputType>, res: Response) { ... } // input 단독 사용 시
  @example
  async function controller(req: AuthRequestWith<never, PathType>, res: Response) { ... } // params 단독 사용 시
  @example
  async function controller(req: AuthRequestWith<InputType, PathType>, res: Response) { ... } // input, params 동시 사용
 */
export interface AuthRequestWith<I, P = never>
  extends RequestWith<I, P>,
    AuthRequest {}
