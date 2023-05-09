## Detail에서 isLiked, isFavorite 추가

## Refresh Token Redis 저장

로그인

-> accessToken 브라우저 쿠키 저장

-> refreshToken Redis 저장

accessToken 1시간 만료, 2시간 삭제
refreshToken 2주 만료

만약 accessToken 만료 시,( 1시간 지났을 때 )
/refresh-token endpoint로
만료된 accessToken과 함께 요청

단, 만료된지 1시간 이내여야 함

-> refresh Token으로 accessToken 재발급

-> 쿠키 덮어쓰기

accessToken 탈취한 경우-
ip 등으로 blacklist 만들기
->2차 인증(핸드폰)
->MFA(구글OTP)

userId가 key, accessToken SET으로 redis 저장해서
새로 발급 시, 이전꺼는 덮어버리기

logout아웃 된 accessToken 쿠키는 blacklist 등록
그거로는 더이상 로그인 못하게

##  