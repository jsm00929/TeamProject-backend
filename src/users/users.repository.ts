import {CreateUserBody} from './dtos/inputs/create_user.body';
import {prismaClient, TxRecord, UserRecord} from "../core/types/tx";

/**
 * Fetch
 */

/**
 * @description
 * 사용자 정보 가져오기(by Id)
 */
async function findById({userId: id, tx}: Pick<UserRecord, 'userId'> & TxRecord) {
    const user = await prismaClient(tx).user.findUnique({where: {id}});

    if (user === null || user.deletedAt !== null) {
        return null;
    }
    return user;
}

async function findByEmail({email, tx}: Pick<UserRecord, 'email'> & TxRecord) {
    const user = await prismaClient(tx).user.findUnique({where: {email}});

    if (user === null || user.deletedAt !== null) {
        return null;
    }
    return user;
}

/**
 * @description
 * 사용자 존재 여부 확인(by Id)
 */
async function isExistsById({userId, tx}: Pick<UserRecord, 'userId'> & TxRecord) {
    return (await findById({userId, tx})) !== null;
}

/**
 * @description
 * 사용자 존재 여부 확인(by Email)
 */
async function isExistsByEmail({email, tx}: Pick<UserRecord, 'email'> & TxRecord) {
    return (await findByEmail({email, tx})) !== null;
}

/**
 * CREATE
 */
async function create(
    {tx}: TxRecord,
    {email, name, password}: CreateUserBody
) {
    const user = await prismaClient(tx).user.create({
        data: {
            email,
            name,
            password,
        },
    });
    return user.id;
}

async function createWithoutPassword(
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
async function update(
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

async function remove({userId, tx}: Pick<UserRecord, 'userId'> & TxRecord) {

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
    findById,
    findByEmail,
    isExistsById,
    isExistsByEmail,
    create,
    createWithoutPassword,
    update,
    remove,
};
