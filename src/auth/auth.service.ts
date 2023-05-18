import {AppError} from '../core/types';
import {ErrorMessages, HttpStatus} from '../core/constants';
import usersRepository from '../users/users.repository';
import {comparePassword, hashPassword} from '../utils/hash';
import {LoginBody} from './dtos/inputs/login.body';
import {SignupBody} from './dtos/inputs/signup.body';
import {fetchGoogleToken, fetchGoogleUserInfo,} from '../pkg/oauth/google/fetchers';
import {prisma} from "../config/db";
import {isPasswordValidOrThrow} from "./validations/is_password_valid_or_throw";

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

        return usersRepository.createUser({tx}, {
            email,
            name,
            password: await hashPassword(password),
        });
    });

}

async function login({email, password}: LoginBody) {

    return prisma.$transaction(async (tx) => {

        const user = await usersRepository.findUserWithPasswordByEmail({email, tx});

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
        const isMatchedPassword = await comparePassword(password, user.password);
        if (!isMatchedPassword) {
            throw AppError.new({
                message: ErrorMessages.INVALID_PASSWORD,
                status: HttpStatus.UNAUTHORIZED,
            });
        }

        // setAuthCookie (userId) -> 알아서 refresh,access 토큰 발급 뒤 cookie설정
        // generateAccessToken, genereateRefreshToken -> setAuthCOokie(accessToken,refreshToken) ->

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
            const user = await usersRepository.findUserByEmail({tx, email});
            if (user !== null) {
                throw AppError.new({
                    message: ErrorMessages.DUPLICATE_USER,
                    status: HttpStatus.CONFLICT,
                });
            }

            return usersRepository.createUserWithoutPassword({
                    tx,
                },
                {
                    email,
                    name,
                    avatarUrl,
                });
        }
    );
}

async function googleLoginRedirect(code: string) {
    const {
        data: {accessToken},
    } = await fetchGoogleToken(code, 'login');

    const {
        data: {email},
    } = await fetchGoogleUserInfo(accessToken);

    return prisma.$transaction(async (tx) => {

        const user = await usersRepository.findUserByEmail({email, tx});

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
