import { AppError } from '../core/types/app_error';
import { ErrorMessages } from '../core/constants/error_messages';
import { HttpStatus } from '../core/constants/http_status';
import usersRepository from './users.repository';
import { UpdateUserAvatarUrlInput } from './dtos/inputs/update_user_avatar_url.input';
import { UpdateUserPasswordInput } from './dtos/update_user_password.input';

async function getMySimpleInfo(userId: number) {
  const mySimpleInfo = await usersRepository.findSimpleInfoById(userId);

  if (mySimpleInfo === null) {
    throw AppError.create({
      message: ErrorMessages.USER_NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }
  return mySimpleInfo;
}

async function getMyDetailInfo(userId: number) {
  const myDetailInfo = await usersRepository.findDetailInfoById(userId);

  if (myDetailInfo === null) {
    throw AppError.create({
      message: ErrorMessages.USER_NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }
  return myDetailInfo;
}

async function getUserById(userId: number) {
  return usersRepository.findById(userId);
}

async function updatePassword(
  userId: number,
  updateUserPasswordInput: UpdateUserPasswordInput,
) {
  const exists = await usersRepository.existsById(userId);

  if (!exists) {
    throw AppError.create({
      message: ErrorMessages.USER_NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }

  await usersRepository.update(userId, updateUserPasswordInput);
}

async function updateMyInfo(
  userId: number,
  updateUserInput: UpdateUserAvatarUrlInput,
) {
  const exists = await usersRepository.existsById(userId);

  if (!exists) {
    throw AppError.create({
      message: ErrorMessages.USER_NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }

  await usersRepository.update(userId, updateUserInput);
}

async function withdraw(userId: number) {
  const exists = await usersRepository.existsById(userId);

  if (!exists) {
    throw AppError.create({
      message: ErrorMessages.USER_NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }

  await usersRepository.remove(userId);
}

export default {
  getMySimpleInfo,
  getMyDetailInfo,
  getUserById,
  updateMyInfo,
  withdraw,
};
