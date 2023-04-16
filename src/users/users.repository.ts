import { prisma } from '../config/db';
import { UserSimpleInfoOutput } from './dtos';
import { CreateUserDto } from './dtos/create_user.input';
import { UpdateUserAvatarUrlInput } from './dtos/inputs/update_user_avatar_url.input';
import { UserDetailInfoOutput } from './dtos/outputs/user_detail_info.output';

async function findSimpleInfoById(
  userId: number,
): Promise<UserSimpleInfoOutput | null> {
  return prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: {
      id: true,
      name: true,
      avatarUrl: true,
    },
  });
}

async function findDetailInfoById(
  userId: number,
): Promise<UserDetailInfoOutput | null> {
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

async function findById(userId: number) {
  return prisma.user.findFirst({ where: { id: userId, deletedAt: null } });
}

async function findByUsername(username: string) {
  return prisma.user.findFirst({ where: { username, deletedAt: null } });
}

async function existsById(userId: number) {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    select: { id: true },
  });

  return user !== null;
}

async function existsByEmail(email: string) {
  const user = await prisma.user.findFirst({
    where: { email, deletedAt: null },
    select: { id: true },
  });

  return user !== null;
}

async function existsByUsername(username: string) {
  const user = await prisma.user.findFirst({
    where: { username, deletedAt: null },
    select: { id: true },
  });

  return user !== null;
}

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

export default {
  findById,
  findByUsername,
  findSimpleInfoById,
  findDetailInfoById,
  existsByEmail,
  existsById,
  existsByUsername,
  create,
  update,
  remove,
};
