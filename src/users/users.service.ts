import usersRepository from "./users.repository";
import { UpdateUserPasswordBody } from "./dtos/inputs/update_my_password.body";
import { UpdateUserNameBody } from "./dtos/inputs/update_my_name.body";
import { hashPassword } from "../utils/hash";
import { prisma } from "../config/db";
import {
  filenameIntoAbsoluteTempPath,
  filenameIntoStaticPath,
  filenameIntoStaticUrl,
  staticUrlIntoPath,
} from "../utils/static_path_resolvers";
import { moveFile, removeFile, removeFileOrThrow } from "../utils/file_utils";
import { log } from "../utils/logger";
import { PickIds } from "../core/types/pick_ids";
import { RemoveUserBody } from "./dtos/inputs/remove_user.body";
import { UserOutput } from "./dtos/outputs/user.output";
import { isUserValidOrThrow } from "../auth/validations/is_user_valid_or_throw";
import { isPasswordValidOrThrow } from "../auth/validations/is_password_valid_or_throw";

async function userById({
  userId,
}: PickIds<"user">): Promise<UserOutput | null> {
  return prisma.$transaction(async (tx) => {
    return usersRepository.findUserById({ userId, tx });
  });
}

async function updatePassword(
  { userId }: PickIds<"user">,
  { oldPassword, newPassword }: UpdateUserPasswordBody
) {
  return prisma.$transaction(async (tx) => {
    const user = await usersRepository.findUserWithPasswordById({ userId, tx });

    isUserValidOrThrow(user);
    await isPasswordValidOrThrow(oldPassword, user!.password);

    const password = await hashPassword(newPassword);
    await usersRepository.updateUserPassword({ userId, tx }, { password });
  });
}

async function updateAvatar({
  userId,
  filename,
}: PickIds<"user"> & { filename: string | null }): Promise<string | null> {
  let user: UserOutput | null = null;
  let absoluteAvatarPath: string | null = null;
  let avatarUrl: string | null = null;

  try {
    return prisma.$transaction(async (tx) => {
      user = await usersRepository.findUserById({ userId, tx });

      isUserValidOrThrow(user);

      const prevAvatarUrl = user!.avatarUrl;

      avatarUrl =
        filename !== null ? filenameIntoStaticUrl(filename, "avatars") : null;

      await usersRepository.updateUserAvatarUrl({ userId, tx }, { avatarUrl });

      if (prevAvatarUrl) {
        const prevAbsoluteAvatarPath = staticUrlIntoPath(
          prevAvatarUrl,
          "avatars",
          true
        );
        await removeFile(prevAbsoluteAvatarPath);
      }

      if (filename === null) {
        return null;
      }
      const absoluteTempPath = filenameIntoAbsoluteTempPath(filename);
      absoluteAvatarPath = filenameIntoStaticPath(filename, "avatars", true);

      await moveFile(absoluteTempPath, absoluteAvatarPath);

      return avatarUrl;
    });
  } catch (error) {
    log.error(error);

    if (absoluteAvatarPath !== null) {
      await removeFileOrThrow(absoluteAvatarPath);
    }
    throw error;
  }
}

async function updateName(
  { userId }: PickIds<"user">,
  { name }: UpdateUserNameBody
) {
  return prisma.$transaction(async (tx) => {
    const user = await usersRepository.findUserById({ userId, tx });

    isUserValidOrThrow(user);

    await usersRepository.updateUserName({ userId, tx }, { name });
  });
}

async function withdraw({
  userId,
  password,
}: PickIds<"user"> & RemoveUserBody) {
  return prisma.$transaction(async (tx) => {
    const user = await usersRepository.findUserWithPasswordById({ userId, tx });

    // validation
    isUserValidOrThrow(user);
    await isPasswordValidOrThrow(password, user!.password);

    await usersRepository.deleteUserSoftly({ userId, tx });
  });
}

export default {
  userById,
  updateAvatar,
  updateName,
  updatePassword,
  withdraw,
};
