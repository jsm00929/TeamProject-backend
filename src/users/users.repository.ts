import { prisma } from '../config/db';
import { ErrorMessages, HttpStatus } from '../core/constants';
import { AppError } from '../core/types';
import { CreateUserDto } from './dtos/create_user.input';

/**
 * 조회(Fetch)
 */
/**
 * @description
 * 사용자 간략 정보 가져오기(by Id)
 */
async function findSimpleInfoById(userId: number) {
  return prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
    },
  });
}

/**
 * @description
 * 사용자 간략 정보 가져오기(by Id)
 * @throws AppError
 * 존재하지 않는 사용자일 경우 오류 발생
 */
async function findSimpleInfoByIdOrThrow(userId: number) {
  const userSimpleInfo = await findSimpleInfoById(userId);
  if (userSimpleInfo === null) {
    throw AppError.new({
      message: ErrorMessages.USER_NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }
  return userSimpleInfo;
}

/**
 * @description
 * 사용자 상세 정보 가져오기(by Id)
 *
 * @throws AppError
 * 존재하지 않는 사용자일 경우 오류 발생
 */
async function findDetailInfoByIdOrThrow(userId: number) {
  const userDetailInfo = await findDetailInfoById(userId);
  if (userDetailInfo === null) {
    throw AppError.new({
      message: ErrorMessages.USER_NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }
  return userDetailInfo;
}

/**
 * @description
 * 사용자 상세 정보 가져오기(by Id)
 */
async function findDetailInfoById(userId: number) {
  return prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: {
      id: true,
      googleId: true,
      username: true,
      email: true,
      name: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

/**
 * @description
 * 사용자 상세 정보 가져오기(by Id)
 */
async function findById(userId: number) {
  return prisma.user.findFirst({ where: { id: userId, deletedAt: null } });
}

async function findByUsername(username: string) {
  return prisma.user.findFirst({ where: { username, deletedAt: null } });
}

async function findByEmail(email: string) {
  return prisma.user.findFirst({ where: { email, deletedAt: null } });
}

/**
 * @description
 * 사용자 존재 여부 확인(by Id)
 */
async function exists(userId: number) {
  const user = await findById(userId);
  return user !== null && user.deletedAt !== null;
}

/**
 * @description
 * 사용자 존재 여부 확인(by Email)
 */
async function existsByEmail(email: string) {
  const user = await prisma.user.findFirst({
    where: { email, deletedAt: null },
    select: { id: true },
  });

  return user !== null;
}

/**
 * @description
 * 사용자 존재 여부 확인(by Username)
 */
async function existsByUsername(username: string) {
  const user = await prisma.user.findFirst({
    where: { username, deletedAt: null },
    select: { id: true },
  });

  return user !== null;
}

/**
 * 생성 및 수정(Mutation)
 */
async function create({ email, name, password, username }: CreateUserDto) {
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password,
      username,
    },
    select: {
      id: true,
    },
  });
  return user.id;
}

async function update(userId: number, updateUserInput) {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: updateUserInput,
    select: { id: true },
  });
}

async function remove(userId: number) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      deletedAt: new Date(),
    },
    select: { id: true },
  });
}

/**
 * 내보내기(export)
 */
export default {
  findById,
  findByUsername,
  findSimpleInfoById,
  findDetailInfoById,
  existsByEmail,
  exists,
  existsByUsername,
  create,
  update,
  remove,
  findDetailInfoByIdOrThrow,
  findSimpleInfoByIdOrThrow,
};
