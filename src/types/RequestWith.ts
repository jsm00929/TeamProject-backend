import { Request } from 'express';

/**
 * @description
 * 사용자가 request body에 입력한 값이 유효한지
 * controller에서 isValid 함수로 검사한 뒤,
 * 유효하지 않으면 오류가 발생하여 handlerErrors로 넘어갈 것이고,
 * 유효하다면 Express의 Request에 입력된 dto의 instance를 만들어
 * unwrap() 메소드로 다음 미들웨어에서 언제든 추출할 수 있도록 바인딩한다.
 * 그러나 기본적으로 Express의 Request interface에는
 * unwrap 메소드가 존재하지 않기 때문에 타입을 일치시키기 위해
 * 해당 인터페이스를 extends로 확장한 것이다.
 */
export interface RequestWith<T> extends Request {
  /**
   *
   * @returns 바인딩 된 dto의 instance
   * @description 사용자가 request body에 입력한 값을 middleware에서 검증한 뒤,
   * 오류가 없다면 이 메소드를 통해 해당 body와 일치하는 dto 타입의 instance를 받아서 사용할 수 있다.
   */
  unwrap: () => T;
}
