import {AppError} from '../core/types';
import {ErrorMessages, HttpStatus} from '../core/constants';
import usersRepository from './users.repository';
import {UpdateUserPasswordBody} from './dtos/inputs/update_my_password.body';
import {UpdateUserNameBody} from './dtos/inputs/update_my_name.body';
import {comparePassword, hashPassword} from '../utils/hash';
import {prisma} from '../config/db';
import {
  filenameIntoAbsoluteTempPath,
  filenameIntoStaticPath,
  filenameIntoStaticUrl,
  staticUrlIntoPath,
} from '../utils/static_path_resolvers';
import {moveFile, removeFile, removeFileOrThrow} from '../utils/file_utils';
import {log} from '../utils/logger';
import {UserRecord} from '../core/types/tx';
import {UserOutput} from '../auth/dtos/outputs/user.output';
import {PickIds} from '../core/types/pick_ids';
import {RemoveUserBody} from "./dtos/inputs/remove_user.body";

async function userById({userId}: PickIds<'user'>): Promise<UserOutput | null> {
    return prisma.$transaction(async (tx) => {
        return usersRepository.findUserById({userId, tx});
    });
}

async function userByEmail({email}: Pick<UserRecord, 'email'>) {
    return prisma.$transaction(async (tx) => {
        return usersRepository.findUserByEmail({email, tx});
    });
}

async function updatePassword(
    {userId}: PickIds<'user'>,
    {oldPassword, newPassword}: UpdateUserPasswordBody,
) {
    return prisma.$transaction(async (tx) => {
        const user = await usersRepository.findUserWithPasswordById({userId, tx});

        if (!user) {
            throw AppError.new({
                message: ErrorMessages.USER_NOT_FOUND,
                status: HttpStatus.UNAUTHORIZED,
            });
        }

        if (
            user.password !== null &&
            oldPassword !== undefined &&
            oldPassword !== null
        ) {
            const isMatchedPassword = await comparePassword(
                oldPassword,
                user.password,
            );
            if (!isMatchedPassword) {
                throw AppError.new({
                    message: ErrorMessages.INVALID_PASSWORD,
                    status: HttpStatus.UNAUTHORIZED,
                });
            }
        }

        const password = await hashPassword(newPassword);
        await usersRepository.updateUserPassword({userId, tx}, {password});
    });
}

async function updateAvatar(
    {userId, filename}: PickIds<'user'> & { filename: string | null }
): Promise<string | null> {

    let user: UserOutput | null = null;
    let absoluteAvatarPath: string | null = null;
    let avatarUrl: string | null = null;

    try {
        return prisma.$transaction(async (tx) => {
            user = await usersRepository.findUserById({userId, tx});

            if (!user) {
                throw AppError.new({
                    message: ErrorMessages.USER_NOT_FOUND,
                    status: HttpStatus.NOT_FOUND,
                });
            }

            const prevAvatarUrl = user.avatarUrl;

            avatarUrl =
                filename !== null ? filenameIntoStaticUrl(filename, 'avatars') : null;

            await usersRepository.updateUserAvatarUrl({userId, tx}, {avatarUrl});

            if (prevAvatarUrl) {
                const prevAbsoluteAvatarPath = staticUrlIntoPath(
                    prevAvatarUrl,
                    'avatars',
                    true,
                );
                await removeFile(prevAbsoluteAvatarPath);
            }

            if (filename === null) {
                return null;
            }
            const absoluteTempPath = filenameIntoAbsoluteTempPath(filename);
            absoluteAvatarPath = filenameIntoStaticPath(filename, 'avatars', true);

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
    {userId}: PickIds<'user'>,
    {name}: UpdateUserNameBody,
) {
    return prisma.$transaction(async (tx) => {
        const exists = await usersRepository.isExistsById({userId, tx});

        if (!exists) {
            throw AppError.new({
                message: ErrorMessages.USER_NOT_FOUND,
                status: HttpStatus.NOT_FOUND,
            });
        }

        await usersRepository.updateUserName({userId, tx}, {name});
    });
}

async function withdraw({userId, password}: PickIds<'user'> & RemoveUserBody) {
    return prisma.$transaction(async (tx) => {
        const user = await usersRepository.findUserWithPasswordById({userId, tx});

        if (!user) {
            throw AppError.new({
                message: ErrorMessages.USER_NOT_FOUND,
                status: HttpStatus.UNAUTHORIZED,
            });
        }

        if (user.password !== null) {
            if (!password || !(await comparePassword(password, user.password))) {
                throw AppError.new({
                    message: ErrorMessages.INVALID_PASSWORD,
                    status: HttpStatus.UNAUTHORIZED,
                });
            }
        }

        await usersRepository.removeUser({userId, tx});
    });
}

export default {
    userById,
    userByEmail,
    updateAvatar,
    updateName,
    updatePassword,
    withdraw,
};
