import { AppError } from '../core/types/app_error';
import { ErrorMessages } from '../core/constants/error_messages';
import { HttpStatus } from '../core/constants/http_status';
import usersRepository from './users.repository';
import { UserSimpleInfoOutput } from './dtos';
import { UserDetailInfoOutput } from './dtos/outputs/user_detail_info.output';
import { UpdateUserPasswordBody } from './dtos/inputs/update_user_password.body';
import { UpdateUserInfoBody } from './dtos/inputs/update_user_info.body';
import { DeleteUserBody } from './dtos/inputs/delete_user.body';
import { comparePassword } from '../utils/hash';
import { prisma } from '../config/db';
import { persistAvatarImage, removeAvatarImageIfExists } from '../utils/files';
import { AppResult } from '../core/types/app_result';
import { STATIC_AVATARS_PATH } from '../config/constants';

async function getSimpleInfo(
  userId: number,
): Promise<UserSimpleInfoOutput | null> {
  return usersRepository.findSimpleInfoById(userId);
}

async function getMySimpleInfo(userId: number): Promise<UserSimpleInfoOutput> {
  return usersRepository.findSimpleInfoByIdOrThrow(userId);
}

async function getMyDetailInfo(userId: number): Promise<UserDetailInfoOutput> {
  return usersRepository.findDetailInfoByIdOrThrow(userId);
}

async function getUserById(userId: number) {
  return usersRepository.findById(userId);
}

async function updatePassword(
  userId: number,
  updateUserPasswordBody: UpdateUserPasswordBody,
) {
  const exists = await usersRepository.exists(userId);

  if (!exists) {
    throw AppError.new({
      message: ErrorMessages.USER_NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }

  await usersRepository.update(userId, updateUserPasswordBody);
}

async function updateAvatar(
  userId: number,
  avatarUrl: string,
  filename: string,
) {
  const user = await usersRepository.findById(userId);

  if (!user) {
    throw AppError.new({
      message: ErrorMessages.USER_NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }

  const prevAvatarUrl = user.avatarUrl;

  try {
    await prisma.$transaction(async (client) => {
      await client.user.update({
        where: {
          id: userId,
        },
        data: {
          avatarUrl,
        },
      });

      if (prevAvatarUrl) {
        await removeAvatarImageIfExists(prevAvatarUrl);
      }
      await persistAvatarImage(filename);
    });
  } catch (error) {
    await removeAvatarImageIfExists(`${STATIC_AVATARS_PATH}/${avatarUrl}`);
    return AppResult.new({
      body: ErrorMessages.INTERNAL_SERVER_ERROR,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

async function updateMyInfo(
  userId: number,
  updateUserInfoBody: UpdateUserInfoBody,
) {
  const exists = await usersRepository.exists(userId);

  if (!exists) {
    throw AppError.new({
      message: ErrorMessages.USER_NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }

  await usersRepository.update(userId, updateUserInfoBody);
}

async function withdraw(userId: number, { password }: DeleteUserBody) {
  const user = await usersRepository.findById(userId);

  if (!user) {
    throw AppError.new({
      message: ErrorMessages.USER_NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }
  const isMatchedPassword = await comparePassword(password, user.password);
  if (!isMatchedPassword) {
    throw AppError.new({
      message: ErrorMessages.INVALID_PASSWORD,
      status: HttpStatus.UNAUTHORIZED,
    });
  }
  await usersRepository.remove(userId);
}

export default {
  getMyDetailInfo,
  getMySimpleInfo,
  getSimpleInfo,
  getUserById,
  updateAvatar,
  updateMyInfo,
  updatePassword,
  withdraw,
};
