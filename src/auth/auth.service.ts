import {AppError} from '../core/types';
import {ErrorMessages, HttpStatus} from '../core/constants';
import usersRepository from '../users/users.repository';
import {comparePassword, hashPassword} from '../utils/hash';
import {LoginBody} from './dtos/inputs/login.body';
import {SignupBody} from './dtos/inputs/signup.body';
import {fetchGoogleToken, fetchGoogleUserInfo,} from '../pkg/oauth/google/fetchers';
import {prisma} from "../config/db";

async function signUp({email, name, password}: SignupBody) {

    return prisma.$transaction(async (tx) => {

        const exists = await usersRepository.isExistsByEmail({email, tx});
        // 이미 가입된 사용자
        if (exists) {
            throw AppError.new({
                message: ErrorMessages.DUPLICATE_EMAIL,
                status: HttpStatus.CONFLICT,
            });
        }

        return usersRepository.create({tx}, {
            email,
            name,
            password: await hashPassword(password),
        });
    });

}

async function login({email, password}: LoginBody) {

    return prisma.$transaction(async (tx) => {

        const user = await usersRepository.findByEmail({email, tx});

        // 로그인 하려는 계정이 DB에 없음
        if (user === null) {
            throw AppError.new({
                message: ErrorMessages.USER_NOT_FOUND,
                status: HttpStatus.NOT_FOUND,
            });
        }

        if (user.password === null) {
            throw AppError.new({
                message: ErrorMessages.NOT_SET_PASSWORD,
                status: HttpStatus.UNAUTHORIZED,
            });
        }

        // 비번이 맞지가 않음
        if (!(await comparePassword(password, user.password))) {
            throw AppError.new({
                message: ErrorMessages.INVALID_PASSWORD,
                status: HttpStatus.UNAUTHORIZED,
            });
        }

        return user.id;
    });

}

async function googleSignupRedirect(code: string) {

    const {
        data: {accessToken},
    } = await fetchGoogleToken(code, 'signup');

    const {
        data: {email, name, picture: avatarUrl},
    } = await fetchGoogleUserInfo(accessToken);


    return prisma.$transaction(async (tx) => {
            const user = await usersRepository.findByEmail({tx, email});
            if (user !== null) {
                throw AppError.new({
                    message: ErrorMessages.DUPLICATE_USER,
                    status: HttpStatus.CONFLICT,
                });
            }

            return usersRepository.createWithoutPassword({
                    tx,
                },
                {
                    email,
                    name,
                    avatarUrl,
                });
        }
    )
        ;
}

async function googleLoginRedirect(code: string) {
    const {
        data: {accessToken},
    } = await fetchGoogleToken(code, 'login');

    const {
        data: {email},
    } = await fetchGoogleUserInfo(accessToken);

    return prisma.$transaction(async (tx) => {

        const user = await usersRepository.findByEmail({email, tx});

        if (!user) {
            throw AppError.new({
                message: ErrorMessages.USER_NOT_FOUND,
                status: HttpStatus.NOT_FOUND,
            });
        }

        return user.id;
    });

}

export default {
    signUp,
    login,
    googleSignupRedirect,
    googleLoginRedirect,
};
