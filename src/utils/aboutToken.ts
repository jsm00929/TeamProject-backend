import { JwtPayload, sign } from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from '../types/AppError';
import { ErrorMessages } from '../types/ErrorMessages';
import { HttpStatus } from '../types/HttpStatus';
import { usersRepository } from '../users/users.repository';
import { ACCESS_TOKEN_EXPIRED_TIMES } from '../config/constants';
import { tokenPayload } from '../auth/dtos/inputs/tokenPayload';

// 토큰 보유한 경우 토큰 검증
export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.cookies.accessToken) {
    throw AppError.create({
      message: ErrorMessages.UNAUTHORIZED_USER,
      status: HttpStatus.UNAUTHORIZED,
    });
  }

  const userInfo = verify(req.cookies.accessToken, process.env.JWT_SECRET);
  console.log(userInfo);
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

  const findUser = await usersRepository.findUserByEmail(userInfo as string);
  if (!findUser) {
    throw AppError.create({
      message: ErrorMessages.USER_NOT_FOUND,
    });
  }
  next(findUser);
}

// export function setAuthCookies() {
//   setAccessToken();
//   setCookies();
// }

// HS256, RS256, ES256
// default: HS256
export function setAccessToken(payload: JwtPayload) {
  return sign(payload, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRED_TIMES,
    algorithm: 'HS256',
  });
}

// export function setTokenCookies(tokenName: string, token: string) {
//   return (req, res, next) => {
//     res.cookie(`${tokenName}`, token, {
//       maxAge: 2 * 60 * 60 * 1000,
//       httpOnly: true,
//       signed: true,
//     });
//   };
// }

export function setTokenCookies(tokenName: string, token: string, res) {
  res.cookie(`${tokenName}`, token, {
    maxAge: 2 * 60 * 60 * 1000,
    httpOnly: true,
    signed: true,
  });
}

export function clearCookie(tokenName: string) {
  return (req, res, next) => {
    res.clearCookies(`${tokenName}`);
  };
}
