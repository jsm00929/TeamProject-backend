import { CreateUserBody } from "./dtos/inputs/create_user.body";
import { Tx, UserRecord } from "../core/types/tx";
import { EmailWithTx, PickIdsWithTx } from "../core/types/pick_ids";
import { CreateUserWithoutPasswordBody } from "./dtos/inputs/create_user_without_password.body";
import { UpdateUserNameBody } from "./dtos/inputs/update_my_name.body";
import { UserOutput, UserWithPasswordOutput } from "./dtos/outputs/user.output";

/**
 * @description
 * FIND
 */
async function findUserById({
  userId,
  tx,
}: PickIdsWithTx<"user">): Promise<UserOutput | null> {
  const user = await tx.user.findUnique({ where: { id: userId } });
  return UserOutput.nullOrFrom(user);
}

async function findUserWithPasswordById({
  userId,
  tx,
}: PickIdsWithTx<"user">): Promise<UserWithPasswordOutput | null> {
  const user = await tx.user.findUnique({ where: { id: userId } });
  return UserWithPasswordOutput.nullOrFrom(user);
}

async function findUserWithPasswordByEmail({
  email,
  tx,
}: EmailWithTx): Promise<UserWithPasswordOutput | null> {
  const user = await tx.user.findUnique({ where: { email } });
  return UserWithPasswordOutput.nullOrFrom(user);
}

async function findUserByEmail({
  email,
  tx,
}: EmailWithTx): Promise<UserOutput | null> {
  const user = await tx.user.findUnique({ where: { email } });
  return UserOutput.nullOrFrom(user);
}

/**
 * @description
 * IS_EXISTS
 */
async function isExistsById({
  userId,
  tx,
}: PickIdsWithTx<"user">): Promise<boolean> {
  const user = await findUserById({ userId, tx });
  return user !== null;
}

async function isExistsByEmail({ email, tx }: EmailWithTx): Promise<boolean> {
  const user = await findUserByEmail({ email, tx });
  return user !== null;
}

// 클라이언트에서 api.get() 쏘면은 쿠키 넣어주고
// 서버에서     api.get() 쏘면은 쿠키를 서버에서 쓰니까 안넣어주는 상태
// api.get({ headers: { COOKIES: cookies } })
//
//
//
//
//
/**
 * @description
 * CREATE
 */
async function createUser(
  { tx }: { tx: Tx },
  { email, name, password }: CreateUserBody
): Promise<number> {
  const user = await tx.user.create({
    data: {
      email,
      name,
      password,
    },
  });
  return user.id;
}

async function createUserWithoutPassword(
  { tx }: { tx: Tx },
  { email, name, avatarUrl }: CreateUserWithoutPasswordBody
) {
  const user = await tx.user.create({
    data: {
      email,
      name,
      avatarUrl,
    },
  });
  return user.id;
}

/**
 * @description
 * UPDATE
 */
async function updateUser(
  { userId, tx }: PickIdsWithTx<"user">,
  data: Omit<Partial<UserRecord>, "email">
) {
  await tx.user.update({
    where: {
      id: userId,
    },
    data,
  });
}

async function updateUserName(
  idWithTx: PickIdsWithTx<"user">,
  data: UpdateUserNameBody
) {
  await updateUser(idWithTx, data);
}

async function updateUserPassword(
  idWithTx: PickIdsWithTx<"user">,
  data: Pick<UserRecord, "password">
) {
  await updateUser(idWithTx, data);
}

async function updateUserAvatarUrl(
  idWithTx: PickIdsWithTx<"user">,
  data: Pick<UserRecord, "avatarUrl">
) {
  await updateUser(idWithTx, data);
}

/**
 * @description
 * REMOVE
 */
async function deleteUserSoftly({ userId, tx }: PickIdsWithTx<"user">) {
  await tx.user.update({
    where: { id: userId },
    data: {
      deletedAt: new Date(),
    },
  });
}

/**
 * export
 */
export default {
  findUserById,
  findUserByEmail,
  findUserWithPasswordById,
  findUserWithPasswordByEmail,
  isExistsById,
  isExistsByEmail,
  createUser,
  createUserWithoutPassword,
  updateUserAvatarUrl,
  updateUserName,
  updateUserPassword,
  deleteUserSoftly,
};
