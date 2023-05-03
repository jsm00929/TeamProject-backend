import {Router} from 'express';
import usersController from './users.controller';
import {handle} from '../core/handle';
import {PaginationQuery} from '../core/dtos/inputs';
import {UserIdParams} from './dtos/inputs/user_id.params';
import {mustAuth} from '../auth/middlewares/must_auth';
import {UpdateMyNameBody} from './dtos/inputs/update_my_name.body';
import {UpdateMyPasswordBody} from './dtos/inputs/update_my_password.body';


import {handleUploadAvatars} from '../core/middlewares/handle_upload_avatars';
import {handleResponse} from '../core/middlewares';
import {DeleteUserBody} from './dtos/inputs/delete_user.body';
import {UserMoviesPaginationQuery} from "../movies/movies_pagination.query";

const usersRouter = Router();

/**
 * @description
 * 현재 로그인 된 사용자의 정보 가져오기
 */
usersRouter.get(
    '/me',
    handle({
        authLevel: 'must',
        controller: usersController.me,
    }),
);

/**
 * @description
 * 특정 사용자의 정보 가져오기
 */
usersRouter.get(
    '/:userId',
    handle({
        paramsCls: UserIdParams,
        controller: usersController.user,
    }),
);

/**
 * @description
 * 현재 로그인 된 사용자의 정보 수정하기
 */
usersRouter.patch(
    '/me/name',
    handle({
        authLevel: 'must',
        bodyCls: UpdateMyNameBody,
        controller: usersController.updateMyName,
    }),
);

/**
 * @description
 * 현재 로그인 된 사용자의 비밀번호 수정하기
 */
usersRouter.patch(
    '/me/password',
    handle({
        authLevel: 'must',
        bodyCls: UpdateMyPasswordBody,
        controller: usersController.updateMyPassword,
    }),
);

/**
 * @description
 * 현재 로그인 된 사용자의 아바타 업로드 및 아바타 url 수정
 */
usersRouter.post(
    '/me/avatars',
    mustAuth,
    handleUploadAvatars.single('avatar'),
    handleResponse(usersController.updateMyAvatar),
);

/**
 * @description
 * 현재 로그인 된 사용자 계정 삭제하기
 */
usersRouter.delete(
    '/me',
    handle({
        authLevel: 'must',
        bodyCls: DeleteUserBody,
        controller: usersController.withdraw,
    }),
);

/**
 * USER MOVIE
 */
/**
 * @description
 * 현재 로그인 된 사용자가 최근 본 영화
 * or 즐겨찾기에 추가한 영화
 * - filter: 'recentlyViewed' | 'favorite'
 */
usersRouter.get('/me/movies',
    handle({
        authLevel: 'must',
        queryCls: UserMoviesPaginationQuery,
        controller: usersController.myMovies
    }));


/**
 * USER REVIEW
 */
/**
 * @description
 * 현재 로그인 된 사용자가 작성한 영화 리뷰 보기
 */
usersRouter.get(
    '/me/movies/reviews',
    handle({
        authLevel: 'must',
        queryCls: PaginationQuery,
        controller: usersController.getMyReviewOverviews,
    }),
);

/**
 * @description
 * 특정 사용자가 작성한 영화 리뷰 보기
 */
// TODO: 정렬 추가
usersRouter.get(
    '/:userId/movies/reviews',
    handle({
        queryCls: PaginationQuery,
        controller: usersController.getReviewOverviews,
    }),
);

export default usersRouter;
