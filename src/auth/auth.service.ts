import { AppError } from '../types/AppError';
import { ErrorMessages } from '../types/ErrorMessages';
import { GoogleLoginCodeQuery } from './dtos/inputs/google_login_code.query';
import { usersRepository } from '../users/users.repository';
import { HttpStatus } from '../types/HttpStatus';
import { fetchToken, getUserInfo } from './oAuth';
import { SignupBody } from './dtos/inputs/signup.body';
import { LoginBody } from './dtos/inputs/login.body';

export const authService = {
  async signup(createUser: SignupBody) {
    try {
      const user = await usersRepository.findUser(createUser);
      if (user) {
        throw AppError.create({
          message: ErrorMessages.DUPLICATE_EMAIL,
          status: HttpStatus.CONFLICT,
        });
      }
      const createdUser = await usersRepository.createUser({
        email: createUser.email,
        name: createUser.name,
        password: createUser.password,
      });

      return createdUser;
    } catch (error) {
      throw new Error(error);
    }
  },

  async login(loginUser: LoginBody) {
    const user = await usersRepository.findUser(loginUser);
    console.log(user);
    if (!user) {
      throw AppError.create({
        message: ErrorMessages.USER_NOT_FOUND,
        status: HttpStatus.CONFLICT,
      });
    }

    return user;
  },

  async googleSignupRedirect(code) {
    // access_type = offline일때만 refresh token 발급
    const access_token = await fetchToken(code, 'signup');
    const userInfo = await getUserInfo(access_token);
    const user = await usersRepository.findUser({ email: userInfo.data.email });
    if (user) {
      throw AppError.create({
        message: ErrorMessages.DUPLICATE_EMAIL,
        status: HttpStatus.CONFLICT,
      });
    }
    const createdUser = await usersRepository.createUserWithoutPassword({
      email: userInfo.data.email,
      name: userInfo.data.name,
    });

    return createdUser;
  },

  async googleLoginRedirect(code) {
    const access_token = await fetchToken(code, 'login');
    const userInfo = await getUserInfo(access_token);
    const user = await usersRepository.findUser({ email: userInfo.data.email });
    console.log(user);
    if (!user) {
      throw AppError.create({
        message: ErrorMessages.USER_NOT_FOUND,
        status: HttpStatus.CONFLICT,
      });
    }

    return user;
  },
};
