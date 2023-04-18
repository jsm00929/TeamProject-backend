import { AppError } from '../core/types/app_error';
import { ErrorMessages } from '../core/constants/error_messages';
import { HttpStatus } from '../core/constants/http_status';
import usersRepository from '../users/users.repository';
import { comparePassword, hashPassword } from '../utils/hash';
import { LoginBody } from './dtos/inputs/login.body';
import { SignupBody } from './dtos/inputs/signup.body';
import {
  fetchGoogleToken,
  fetchGoogleUserInfo,
} from '../pkg/oauth/google/fetchers';

async function signUp({ email, name, password, username }: SignupBody) {
  const exists = await usersRepository.existsByUsername(username);
  // 이미 가입된 사용자
  if (exists) {
    throw AppError.new({
      message: ErrorMessages.DUPLICATE_USER,
      status: HttpStatus.CONFLICT,
    });
  }

  const isDuplicateEmail = await usersRepository.existsByEmail(username);
  // 이메일 중복 확인..
  if (isDuplicateEmail) {
    throw AppError.new({
      message: ErrorMessages.DUPLICATE_EMAIL,
      status: HttpStatus.CONFLICT,
    });
  }
  const userId = await usersRepository.create({
    email,
    name,
    password: await hashPassword(password),
    username,
  });
  return userId;
}

async function login({ username, password }: LoginBody) {
  const user = await usersRepository.findByUsername(username);

  // 로그인 하려는 계정이 DB에 없음
  if (!user) {
    throw AppError.new({
      message: ErrorMessages.USER_NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }
  // 비번이 맞지가 않음
  if (!comparePassword(password, user.password)) {
    throw AppError.new({
      message: ErrorMessages.INVALID_PASSWORD,
      status: HttpStatus.UNAUTHORIZED,
    });
  }

  return user.id;
}

async function googleSignupRedirect(code: string) {
  const {
    data: { accessToken },
  } = await fetchGoogleToken(code, 'signup');

  const {
    data: { id, email },
  } = await fetchGoogleUserInfo(accessToken);

  // TODO
  const user = await usersRepository.findByEmail(email);

  if (user) {
    if (user.googleId !== null) {
      throw AppError.new({
        message: ErrorMessages.DUPLICATE_USER,
        status: HttpStatus.CONFLICT,
      });
    }

    return usersRepository.update(user.id, {
      googleId: user.googleId,
    });
  }

  // password is nullable?
  // createWithGoogle
  // await usersRepository.create({});
}

async function googleLoginRedirect(code: string) {
  const {
    data: { accessToken },
  } = await fetchGoogleToken(code, 'signup');

  const {
    data: { id, email, name, picture },
  } = await fetchGoogleUserInfo(accessToken);

  // TODO
  const exists = await usersRepository.existsByEmail(email);
  if (!exists) {
    throw AppError.new({
      message: ErrorMessages.USER_NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }

  // TODO
  // 필드 결정
  // await usersRepository.create({ email, name, password: null, username });
}

export default {
  signUp,
  login,
  googleSignupRedirect,
  googleLoginRedirect,
};
