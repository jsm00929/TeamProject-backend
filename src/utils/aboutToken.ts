import { JwtPayload, sign } from 'jsonwebtoken';
import { verify } from 'jsonwebtoken';
import { AppError } from '../types/AppError';
import { ErrorMessages } from '../types/ErrorMessages';
import { HttpStatus } from '../types/HttpStatus';
import { usersRepository } from '../users/users.repository';
import {
  ACCESS_TOKEN_COOKIE_MAX_AGE,
  ACCESS_TOKEN_EXPIRED_TIMES,
  REFRESH_TOKEN_EXPIRED_TIMES,
} from '../config/constants';

// 토큰 보유한 경우 토큰 검증
export async function verifyAccessToken(accessToken) {
  try {
    const payload = verify(accessToken, process.env.JWT_SECRET);
    // verify(
    //   req.cookies.accessToken,
    //   process.env.JWT_SECRET,
    //   function (error, decoded) {
    //     if (error)
    //       throw AppError.create({
    //         message: error.name,
    //         status: HttpStatus.UNAUTHORIZED,
    //       });
    //     return decoded;
    //   },
    //);

    const findUser = await usersRepository.findUserByEmail(payload as string);
    if (!findUser) {
      throw AppError.create({
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }
    return payload;
  } catch (error) {
    if (error.name === 'TokenExpiredError')
      throw AppError.create({
        message: ErrorMessages.EXPIRED_ACCESS_TOKEN,
      });
    throw AppError.create({
      message: ErrorMessages.UNAUTHORIZED_USER,
    });
  }
}

export function verifyRefreshToken(refreshToken): JwtPayload {
  try {
    return verify(refreshToken, process.env.JWT_SECRET) as JwtPayload;
  } catch (error) {
    if (error.name === 'TokenExpiredError')
      throw AppError.create({
        message: ErrorMessages.EXPIRED_REFRESH_TOKEN,
      });
    throw AppError.create({
      message: ErrorMessages.UNAUTHORIZED_USER,
    });
  }
}

// export function setAuthCookies() {
//   setAccessToken();
//   setCookies();
// }

// HS256, RS256, ES256
// default: HS256
export function generateAccessToken(payload: JwtPayload) {
  return sign(payload, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRED_TIMES,
    algorithm: 'HS256',
  });
}

export function generateRefreshToken(payload: JwtPayload) {
  return sign(payload, process.env.JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRED_TIMES,
    algorithm: 'HS256',
  });
}

export function setAccessTokenCookie(tokenName: string, token: string, res) {
  res.cookie(`${tokenName}`, token, {
    maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE,
    httpOnly: true,
    signed: true,
  });
}

export function clearCookie(tokenName: string, res) {
  return res.clearCookies(`${tokenName}`);
}
