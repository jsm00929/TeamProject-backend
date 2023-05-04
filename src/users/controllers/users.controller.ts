import usersService from '../users.service';
import {AppError, AuthRequest, AuthRequestWith, RequestWith,} from '../../core/types';
import {AppResult} from '../../core/types/app_result';
import {UserIdParams} from '../dtos/inputs/user_id.params';
import {UpdateMyPasswordBody} from '../dtos/inputs/update_my_password.body';
import {UpdateMyNameBody} from '../dtos/inputs/update_my_name.body';
import {ErrorMessages, HttpStatus} from '../../core/constants';
import {UpdateAvatarOutput} from '../dtos/outputs/update_avatar.output';
import {clearAuthCookies} from '../../utils/cookie_store';
import {Response, Router} from 'express';
import {DeleteUserBody} from '../dtos/inputs/delete_user.body';
import {handle} from "../../core/handle";
import {handleUploadAvatars} from "../../core/middlewares/handle_upload_avatars";
import {mustAuth} from "../../auth/middlewares/must_auth";
import {handleResponse} from "../../core/middlewares";

export const usersRouter = Router();
/**
 * @description
 * 현재 로그인 된 사용자의 정보 가져오기
 */
usersRouter.get('/me',
    handle({
        authLevel: 'must',
        controller: me,
    })
);

async function me(req: AuthRequest, res: Response) {
    const {userId} = req;
    // 로그인 되어 있지 않은 경우
    const me = await usersService.userById({userId});

    if (me === null) {
        // 이미 탈퇴한 회원인 경우 쿠키를 지우고 에러를 던진다.
        clearAuthCookies(res);
        AppError.new({
            message: ErrorMessages.USER_NOT_FOUND,
            status: HttpStatus.NOT_FOUND,
        });
    }

    return AppResult.new({body: me});
}

/**
 * @description
 * 특정 사용자의 정보 가져오기
 */
usersRouter.get(
    '/:userId',
    handle({
        paramsCls: UserIdParams,
        controller: user,
    }),
);

async function user(req: RequestWith<never, UserIdParams>) {
    const {userId} = req.unwrapParams();
    const user = await usersService.userById({userId});

    return AppResult.new({body: user});
}

/**
 * @description
 * 현재 로그인 된 사용자 비밀번호 수정
 */
usersRouter.patch(
    '/me/password',
    handle({
        authLevel: 'must',
        bodyCls: UpdateMyPasswordBody,
        controller: updateMyPassword,
    }),
);

async function updateMyPassword(
    req: AuthRequestWith<UpdateMyPasswordBody>,
    res: Response,
) {
    const {userId} = req;
    const body = req.unwrap();

    try {
        await usersService.updatePassword({userId}, body);
    } catch (error) {
        if (
            error instanceof AppError &&
            error.message === ErrorMessages.USER_NOT_FOUND
        ) {
            clearAuthCookies(res);
        }
        throw error;
    }
}

/**
 * @description
 * 현재 로그인 된 사용자 이름 수정
 */
usersRouter.patch(
    '/me/name',
    handle({
        authLevel: 'must',
        bodyCls: UpdateMyNameBody,
        controller: updateMyName,
    }),
);

async function updateMyName(
    req: AuthRequestWith<UpdateMyNameBody>,
    res: Response,
) {
    const {userId} = req;
    const body = req.unwrap();

    try {
        await usersService.updateName({userId}, body);
    } catch (error) {
        if (
            error instanceof AppError &&
            error.message === ErrorMessages.USER_NOT_FOUND
        ) {
            clearAuthCookies(res);
        }
        throw error;
    }
}

/**
 * @description
 * 현재 로그인 된 사용자의 아바타 업로드 및 아바타 url 수정
 */
usersRouter.post(
    '/me/avatars',
    mustAuth,
    handleUploadAvatars.single('avatar'),
    handleResponse(updateMyAvatar),
);

async function updateMyAvatar(
    req: AuthRequest & { file: Express.Multer.File },
) {
    const {
        userId,
        file: {filename},
    } = req;

    const avatarUrl = await usersService.updateAvatar({userId, filename});

    return AppResult.new({
        body: {avatarUrl} as UpdateAvatarOutput,
        status: HttpStatus.CREATED,
    });
}

/**
 * @description
 * 현재 로그인 된 사용자 계정 삭제
 */
usersRouter.delete(
    '/me',
    handle({
        authLevel: 'must',
        bodyCls: DeleteUserBody,
        controller: withdraw,
    }),
);

async function withdraw(req: AuthRequestWith<DeleteUserBody>) {
    const {userId} = req;
    const {password} = req.unwrap();
    await usersService.withdraw({userId, password});
}
