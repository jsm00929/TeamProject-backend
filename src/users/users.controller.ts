import usersService from './users.service';
import {AppError, AuthRequest, AuthRequestWith, RequestWith,} from '../core/types';
import {AppResult} from '../core/types/app_result';
import {UserIdParams} from './dtos/inputs/user_id.params';
import reviewsService from '../reviews/reviews.service';
import {PaginationQuery} from '../core/dtos/inputs';
import moviesService from '../movies/movies.service';
import {UpdateMyPasswordBody} from './dtos/inputs/update_my_password.body';
import {UpdateMyNameBody} from './dtos/inputs/update_my_name.body';
import {ErrorMessages, HttpStatus} from '../core/constants';
import {UpdateAvatarOutput} from './dtos/outputs/update_avatar.output';
import {clearAuthCookies} from '../utils/cookie_store';
import {Response} from 'express';
import {DeleteUserBody} from './dtos/inputs/delete_user.body';
import {UserMoviesPaginationQuery} from "../movies/movies_pagination.query";

async function me(req: AuthRequest, res: Response) {
    const userId = req.userId;
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

async function meDetail(req: AuthRequest, res: Response) {
    const userId = req.userId;
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

async function user(req: RequestWith<never, UserIdParams>) {
    const {userId} = req.unwrapParams();
    const user = await usersService.userById({userId});

    return AppResult.new({body: user});
}

async function updateMyPassword(
    req: AuthRequestWith<UpdateMyPasswordBody>,
    res: Response,
) {
    const userId = req.userId;
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

async function updateMyName(
    req: AuthRequestWith<UpdateMyNameBody>,
    res: Response,
) {
    const userId = req.userId;
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

async function withdraw(req: AuthRequestWith<DeleteUserBody>) {
    const userId = req.userId;
    const {password} = req.unwrap();
    await usersService.withdraw({userId, password});
}

/**
 * REVIEWS
 */
// TODO:
async function getMyReviewOverviews(req: AuthRequestWith<PaginationQuery>) {
    const {userId} = req;
    const {count} = req.unwrap();
    //
    // const myReviews = await reviewsService.getReviewOverviewsByUserId({
    //     userId,
    //     // TODO:
    //     // skip,
    //     // take: count + 1,
    // });

    return AppResult.new({body: {}});
}

async function getReviewOverviews(
    req: RequestWith<PaginationQuery, UserIdParams>,
) {
    const {userId} = req.unwrapParams();
    const {after, count} = req.unwrap();

    const reviews = await reviewsService.getReviewOverviewsByUserId({
        userId,
        after,
        count,
    });

    return AppResult.new({body: reviews});
}

/**
 * MOVIES
 */
async function myMovies(req: AuthRequestWith<UserMoviesPaginationQuery>) {
    const {userId} = req;
    const {count, after, filter, include} = req.unwrap();

    const movies = await moviesService.userMovies(
        {userId},
        {count, after, filter, include},
    );

    return AppResult.new({body: movies});
}


/**
 * EXPORT
 */
export default {
    me,
    meDetail,
    user,
    updateMyName,
    updateMyPassword,
    updateMyAvatar,
    withdraw,
    getMyReviewOverviews,
    getReviewOverviews,
    myMovies,
};
