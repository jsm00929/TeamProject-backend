import { AppError } from '../core/types/app_error';
import { ErrorMessages } from '../core/constants/error_messages';
import { HttpStatus } from '../core/constants/http_status';
import usersRepository from './users.repository';
import {
  UserOutput,
  userEntityIntoUserOutput,
} from './dtos/outputs/user.output';
import { UpdateMyPasswordBody } from './dtos/inputs/update_my_password.body';
import { UpdateMeBody } from './dtos/inputs/update_user_info.body';
import { comparePassword } from '../utils/hash';
import { prisma } from '../config/db';
import { AppResult } from '../core/types/app_result';
import {
  filenameIntoAbsoluteTempPath,
  filenameIntoStaticPath,
  filenameIntoStaticUrl,
  staticUrlIntoPath,
} from '../utils/static_path_resolvers';
import { moveFile, removeFileOrThrow, removeFile } from '../utils/file_utils';
import { log } from '../utils/logger';
import { DeleteUserBody } from './dtos/inputs/delete_user.body';

async function userById(userId: number): Promise<UserOutput | null> {
  const user = await usersRepository.findById(userId);
  return user !== null ? userEntityIntoUserOutput(user) : null;
}

async function userByEmail(email: string): Promise<UserOutput | null> {
  const user = await usersRepository.findByEmail(email);
  return user !== null ? userEntityIntoUserOutput(user) : null;
}

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

async function update(userId: number, updateUserInfoBody: UpdateMeBody) {
  const exists = await usersRepository.isExistsById(userId);

  if (!exists) {
    throw AppError.new({
      message: ErrorMessages.USER_NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }

  await usersRepository.update(userId, updateUserInfoBody);
}

async function withdraw(userId: number, password?: string) {
  const user = await usersRepository.findById(userId);

  if (!user) {
    throw AppError.new({
      message: ErrorMessages.USER_NOT_FOUND,
      status: HttpStatus.UNAUTHORIZED,
    });
  }

  if (user.password !== null) {
    if (!password || !(await comparePassword(password, user.password))) {
      throw AppError.new({
        message: ErrorMessages.INVALID_PASSWORD,
        status: HttpStatus.UNAUTHORIZED,
      });
    }
  }

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
