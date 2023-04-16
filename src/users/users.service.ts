import { AppError } from '../core/types/app_error';
import { ErrorMessages } from '../core/constants/error_messages';
import { HttpStatus } from '../core/constants/http_status';
import usersRepository from './users.repository';
import { UpdateUserAvatarUrlBody } from './dtos/inputs/update_user_avatar_url.body';
import { UpdateUserPasswordInput } from './dtos/update_user_password.input';
import { UserSimpleInfoOutput } from './dtos';
import { UserDetailInfoOutput } from './dtos/outputs/user_detail_info.output';

async function getSimpleInfo(
  userId: number,
): Promise<UserSimpleInfoOutput | null> {
  return usersRepository.findSimpleInfoById(userId);
}

async function mustGetMySimpleInfo(
  userId: number,
): Promise<UserSimpleInfoOutput> {
  return usersRepository.findSimpleInfoByIdOrThrow(userId);
}

async function mustGetMyDetailInfo(
  userId: number,
): Promise<UserDetailInfoOutput> {
  return usersRepository.findDetailInfoByIdOrThrow(userId);
}

async function getUserById(userId: number) {
  return usersRepository.findById(userId);
}

async function updatePassword(
  userId: number,
  updateUserPasswordInput: UpdateUserPasswordInput,
) {
  const exists = await usersRepository.exists(userId);

  if (!exists) {
    throw AppError.new({
      message: ErrorMessages.USER_NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }

  await usersRepository.update(userId, updateUserPasswordInput);
}

async function updateMyInfo(
  userId: number,
  updateUserInput: UpdateUserAvatarUrlBody,
) {
  const exists = await usersRepository.exists(userId);

  if (!exists) {
    throw AppError.new({
      message: ErrorMessages.USER_NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }

  await usersRepository.update(userId, updateUserInput);
}

async function withdraw(userId: number) {
  const exists = await usersRepository.exists(userId);

  if (!exists) {
    throw AppError.new({
      message: ErrorMessages.USER_NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }

  await usersRepository.remove(userId);
}

export default {
  mustGetMyDetailInfo,
  mustGetMySimpleInfo,
  getSimpleInfo,
  getUserById,
  updateMyInfo,
  withdraw,
};
