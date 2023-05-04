import {CreateUserBody} from './dtos/inputs/create_user.body';
import {prismaClient, TxRecord, UserRecord} from "../core/types/tx";
import {UserOutput, UserWithPasswordOutput} from "../auth/dtos/outputs/user.output";

/**
 * Fetch
 */

/**
 * @description
 * 사용자 정보 가져오기(by Id)
 */

async function findUserById(
    {userId: id, tx}: Pick<UserRecord, 'userId'> & TxRecord
): Promise<UserOutput | null> {
    const user = await prismaClient(tx).user.findUnique({where: {id}});

    if (user === null || user.deletedAt !== null) {
        return null;
    }
    return UserOutput.from(user);
}

async function findUserWithPasswordById(
    {userId: id, tx}: Pick<UserRecord, 'userId'> & TxRecord
): Promise<UserWithPasswordOutput | null> {
    const user = await prismaClient(tx).user.findUnique({where: {id}});

    if (user === null || user.deletedAt !== null) {
        return null;
    }
    return UserWithPasswordOutput.from(user);
}

async function findUserWithPasswordByEmail(
    {email, tx}: Pick<UserRecord, 'email'> & TxRecord
): Promise<UserWithPasswordOutput | null> {
    const user = await prismaClient(tx).user.findUnique({where: {email}});

    if (user === null || user.deletedAt !== null) {
        return null;
    }
    return UserWithPasswordOutput.from(user);
}


async function findUserByEmail(
    {email, tx}: Pick<UserRecord, 'email'> & TxRecord
): Promise<UserOutput | null> {

    const user = await prismaClient(tx).user.findUnique({where: {email}});

    if (user === null || user.deletedAt !== null) {
        return null;
    }
    return UserOutput.from(user);
}

/**
 * @description
 * 사용자 존재 여부 확인(by Id)
 */
async function isExistsById(
    {userId, tx}: Pick<UserRecord, 'userId'> & TxRecord
): Promise<boolean> {
    return (await findUserById({userId, tx})) !== null;
}

/**
 * @description
 * 사용자 존재 여부 확인(by Email)
 */
async function isExistsByEmail(
    {email, tx}: Pick<UserRecord, 'email'> & TxRecord
): Promise<boolean> {
    return (await findUserByEmail({email, tx})) !== null;
}

/**
 * CREATE
 */
async function createUser(
    {tx}: TxRecord,
    {email, name, password}: CreateUserBody
): Promise<number> {
    const user = await prismaClient(tx).user.create({
        data: {
            email,
            name,
            password,
        },
    });
    return user.id;
}

async function createUserWithoutPassword(
    {tx}: TxRecord,
    {
        email,
        name,
        avatarUrl,
    }: Pick<UserRecord, 'name' | 'avatarUrl' | 'email'>) {
    const user = await prismaClient(tx).user.create({
        data: {
            email,
            name,
            avatarUrl,
        },
    });
    return user.id;
}

/**
 * UPDATE
 */
async function updateUser(
    {userId, tx}: Pick<UserRecord, 'userId'> & TxRecord,
    data: Omit<Partial<UserRecord>, 'email'>
) {

    await prismaClient(tx).user.update({
        where: {
            id: userId,
        },
        data,
    });
}

async function removeUser({userId, tx}: Pick<UserRecord, 'userId'> & TxRecord) {

    await prismaClient(tx).user.update({
        where: {id: userId},
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
    updateUser,
    removeUser,
};
