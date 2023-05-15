import { prisma } from '../config/db';
import { CreateUserDto } from './dtos/create-user.dto';
import { SearchUserDto } from './dtos/search-user.dto';

export const usersRepository = {
  async createUser(userInfo: CreateUserDto) {
    const user = await prisma.user.create({
      data: {
        email: userInfo.email,
        name: userInfo.name,
        password: userInfo.password,
      },
    });
    return user;
  },

  async createUserWithoutPassword(userInfo: CreateUserDto) {
    const user = await prisma.user.create({
      data: {
        email: userInfo.email,
        name: userInfo.name,
      },
    });
    return user;
  },

  async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    return user;
  },
};
