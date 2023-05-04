import {AppError} from '../core/types';
import {ErrorMessages, HttpStatus} from '../core/constants';
import usersRepository from './users.repository';
import {UpdateMyPasswordBody} from './dtos/inputs/update_my_password.body';
import {UpdateMyNameBody} from './dtos/inputs/update_my_name.body';
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
import {UserRecord} from "../core/types/tx";
import {UserOutput} from "../auth/dtos/outputs/user.output";

async function userById({userId}: Pick<UserRecord, 'userId'>): Promise<UserOutput | null> {
    return usersRepository.findUserById({userId});
}

async function userByEmail({email}: Pick<UserRecord, 'email'>) {
    return usersRepository.findUserByEmail({email});
}

async function updatePassword(
    {userId}: Pick<UserRecord, 'userId'>,
    {oldPassword, newPassword}: UpdateMyPasswordBody,
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
            const isMatchedPassword = await comparePassword(oldPassword, user.password);
            if (!isMatchedPassword) {
                throw AppError.new({
                    message: ErrorMessages.INVALID_PASSWORD,
                    status: HttpStatus.UNAUTHORIZED,
                });
            }
        }

        const hashedPassword = await hashPassword(newPassword);
        await usersRepository.updateUser({userId, tx}, {password: hashedPassword});
    });


}

async function updateAvatar(
    {userId, filename}: Pick<UserRecord, 'userId'> & { filename: string | null }
) {

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

            avatarUrl = filename !== null ? filenameIntoStaticUrl(filename, 'avatars') : null;

            await usersRepository.updateUser({userId, tx}, {avatarUrl});

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
    {userId}: Pick<UserRecord, 'userId'>,
    {name}: UpdateMyNameBody
) {

    return prisma.$transaction(async (tx) => {

        const exists = await usersRepository.isExistsById({userId, tx});

        if (!exists) {
            throw AppError.new({
                message: ErrorMessages.USER_NOT_FOUND,
                status: HttpStatus.NOT_FOUND,
            });
        }

        await usersRepository.updateUser({userId, tx}, {name});

    });

}

async function withdraw(
    {userId, password}: Pick<UserRecord, 'userId'> & Pick<Partial<UserRecord>, 'password'>
) {

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
