import { prisma } from '../config/db';
import { ErrorMessages, HttpStatus } from '../core/constants';
import { AppError } from '../core/types';
import { CreateUserBody } from './dtos/inputs/create_user.body';

/**
 * 조회(Fetch)
 */

/**
 * @description
 * 사용자 정보 가져오기(by Id)
 */
async function findById(userId: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (user === null || user.deletedAt !== null) {
    return null;
  }
  return user;
}

async function findByEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (user === null || user.deletedAt !== null) {
    return null;
  }
  return user;
}

/**
 * @description
 * 사용자 존재 여부 확인(by Id)
 */
async function isExistsById(userId: number) {
  return (await findById(userId)) !== null;
}

/**
 * @description
 * 사용자 존재 여부 확인(by Email)
 */
async function isExistsByEmail(email: string) {
  return (await findByEmail(email)) !== null;
}

/**
 * 생성 및 수정(Mutation)
 */
async function create({ email, name, password }: CreateUserBody) {
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password,
    },
  });
  return user.id;
}

async function createWithoutPassword({
  email,
  name,
  avatarUrl,
}: {
  email: string;
  name: string;
  avatarUrl?: string;
}) {
  const user = await prisma.user.create({
    data: {
      email,
      name,
      avatarUrl,
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
  });
}

async function remove(userId: number) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      deletedAt: new Date(),
    },
  });
}

/**
 * 내보내기(export)
 */
export default {
  findById,
  findByEmail,
  isExistsById,
  isExistsByEmail,
  create,
  createWithoutPassword,
  update,
  remove,
};
