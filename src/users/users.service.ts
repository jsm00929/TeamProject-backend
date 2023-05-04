import { AppError } from '../core/types';
import { ErrorMessages, HttpStatus } from '../core/constants';
import usersRepository from './users.repository';
import {
  userEntityIntoUserOutput,
  UserOutput,
} from './dtos/outputs/user.output';
import { UpdateMyPasswordBody } from './dtos/inputs/update_my_password.body';
import { UpdateMeBody } from './dtos/inputs/update_me.body';
import { comparePassword } from '../utils/hash';
import { prisma } from '../config/db';
import { AppResult } from '../core/types/app_result';
import {
  filenameIntoAbsoluteTempPath,
  filenameIntoStaticPath,
  filenameIntoStaticUrl,
  staticUrlIntoPath,
} from '../utils/static_path_resolvers';
import { moveFile, removeFile, removeFileOrThrow } from '../utils/file_utils';
import { log } from '../utils/logger';

/**
 * @description
 * Given a user ID, this function returns a Promise
 * that resolves to a UserOutput object representing the user with that ID.
 * If the user is not found, the Promise resolves to null.
 */
async function userById(userId: number): Promise<UserOutput | null> {
  const user = await usersRepository.findById(userId);
  return user !== null ? userEntityIntoUserOutput(user) : null;
}

/**
 * @description
 * Given a user's email address, this function returns a Promise
 * that resolves to a UserOutput object representing the user with that email address.
 * If the user is not found, the Promise resolves to null.
 */
async function userByEmail(email: string): Promise<UserOutput | null> {
  const user = await usersRepository.findByEmail(email);
  return user !== null ? userEntityIntoUserOutput(user) : null;
}

/**
 * @description
 * Given a user ID and an object containing the old password and the new password,
 * this function updates the user's password in the database.
 * If the old password is incorrect,
 * the function throws an AppError with a status code of UNAUTHORIZED
 */
async function updatePassword(
  userId: number,
  { oldPassword, newPassword }: UpdateMyPasswordBody,
) {
  const user = await usersRepository.findById(userId);

  if (!user) {
    throw AppError.new({
      message: ErrorMessages.USER_NOT_FOUND,
      status: HttpStatus.UNAUTHORIZED,
    });
  }

  if (
    user.password !== null &&
    oldPassword !== undefined &&
    oldPassword !== null
  ) {
    const isMatchedPassword = await comparePassword(oldPassword, user.password);
    if (!isMatchedPassword) {
      throw AppError.new({
        message: ErrorMessages.INVALID_PASSWORD,
        status: HttpStatus.UNAUTHORIZED,
      });
    }
  }

  await usersRepository.update(userId, { password: newPassword });
}

/**
 * @description
 * Given a user ID and a filename,
 * this function updates the user's avatarUrl in the database
 * and moves the avatar file from a temporary location to a permanent location.
 * If an error occurs during this process,
 * the function logs the error and throws an AppResult with a status code of INTERNAL_SERVER_ERROR
 */
async function updateAvatar(userId: number, filename: string) {
  const user = await usersRepository.findById(userId);

  if (!user) {
    throw AppError.new({
      message: ErrorMessages.USER_NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }

  const prevAvatarUrl = user.avatarUrl;

  const avatarUrl = filenameIntoStaticUrl(filename, 'avatars');
  let absoluteAvatarPath: string | null = null;

  try {
    return await prisma.$transaction(async (client) => {
      const user = await client.user.update({
        where: {
          id: userId,
        },
        data: {
          avatarUrl,
        },
      });

      if (prevAvatarUrl) {
        const prevAbsoluteAvatarPath = staticUrlIntoPath(
          prevAvatarUrl,
          'avatars',
          true,
        );
        await removeFile(prevAbsoluteAvatarPath);
      }

      const absoluteTempPath = filenameIntoAbsoluteTempPath(filename);
      absoluteAvatarPath = filenameIntoStaticPath(filename, 'avatars', true);

      await moveFile(absoluteTempPath, absoluteAvatarPath);

      return user.avatarUrl;
    });
  } catch (error) {
    log.error(error);

    if (absoluteAvatarPath !== null) {
      await removeFileOrThrow(absoluteAvatarPath);
    }
    return AppResult.new({
      body: ErrorMessages.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

/**
 * @description
 * Given a user ID and an object containing user information,
 * this function updates the user's information in the database.
 */
async function update(userId: number, body: UpdateMeBody) {
  const exists = await usersRepository.isExistsById(userId);

  if (!exists) {
    throw AppError.new({
      message: ErrorMessages.USER_NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }

  await usersRepository.update(userId, body);
}

/**
 * @description
 * Given a user ID and an optional password,
 * this function removes the user from the database.
 * If the user is not found,
 * the function throws an AppError with a status code of UNAUTHORIZED.
 * If a password is provided and it is incorrect,
 * the function throws an AppError with a status code of UNAUTHORIZED.
 */
async function withdraw(userId: number, password?: string) {
  const user = await usersRepository.findById(userId);

  if (user === null) {
    throw AppError.new({
      message: ErrorMessages.USER_NOT_FOUND,
      status: HttpStatus.UNAUTHORIZED,
    });
  }

  // if user set password before,
  // check password is correct
  // if not, throw UNAUTHORIZED error
  if (user.password !== null) {
    if (!password || !(await comparePassword(password, user.password))) {
      throw AppError.new({
        message: ErrorMessages.INVALID_PASSWORD,
        status: HttpStatus.UNAUTHORIZED,
      });
    }
  }

  // but if user only has signed up with Google
  // and didn't set password before,
  // withdraw user without checking password
  await usersRepository.remove(userId);
}

export default {
  userById,
  userByEmail,
  updateAvatar,
  update,
  updatePassword,
  withdraw,
};
