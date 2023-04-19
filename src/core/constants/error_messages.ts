/**
 *
 * @description
 * 오류 메세지를 깡으로 문자열로 입력하지 않고, 모아서 변수로 관리하도록 만든
 * 단순한 문자열 맵핑 enum
 * @example
 * const errMsg = ErrorMessages.NOT_FOUND;
 *
 * console.log(errMsg); // 페이지를 찾을 수 없습니다?
 *
 * res.json({
 *    message: errMsg,
 * })
 */
/**
 * @swagger
 * components:
 *  schemas:
 *    INVALID_REQUEST_BODY:
 *      type: string
 *      x-enums:
 *        - enum: '입력 값이 많이 구데긴대요?'
 *          description: 유효하지 않은 request body
 *        - enum: '입력 query가 구데긴대요?'
 *          description: 유효하지 않은 request query
 *
 */
export enum ErrorMessages {
  INVALID_REQUEST_INPUT = '입력 값이 많이 구데긴대요?',
  INVALID_REQUEST_BODY = '입력 값이 구데긴대요?',
  INVALID_REQUEST_QUERY = '입력 query가 구데긴대요?',
  INVALID_REQUEST_PARAMS = '입력 params가 구데긴대요?',
  NOT_FOUND = '자원을 찾을 수 없습니다?',
  INTERNAL_SERVER_ERROR = '알 수 없는 오류인대요?',
  INVALID_TOKEN = '말 같지도 않은 토큰을 주셨내요?',
  UNAUTHORIZED_USER = '로그인 꼮 하새요?',
  DUPLICATE_USER = '이미 존재하는 사용자인대요?',
  DUPLICATE_EMAIL = '이미 존재하는 이매일인대요?',
  USER_NOT_FOUND = '가입을 한 적이 없내요? 가입부터 하새요',
  INVALID_PASSWORD = '비번이 틀리내요??',
  EXPIRED_ACCESS_TOKEN = '토큰 만료 기간 지납',
  EXPIRED_REFRESH_TOKEN = '토큰 리프래시불가능',
  PERMISSION_DENIED = '이 걸 할 권한이 없느내요?',
  INVALID_FILE_TYPE = '지원되지 않는 파일 형식입니다? : ',
  NOT_FOUND_ENDPOINT = '존재하지 않는 엔드포인트입니다. 경로를 잘~~😊 확인해주세요?',
  NOT_SET_PASSWORD = '비밀번호를 설정하지 않으셨습니다. 꾸끌 로그인을 하신것 같은 대 요?^^',
}
