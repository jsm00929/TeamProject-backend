import { Router } from 'express';
import usersController from './users.controller';
import { UpdateUserAvatarUrlBody } from './dtos/inputs/update_user_avatar_url.body';
import { handle } from '../core/handle';
import { PaginationQuery } from '../core/dtos/inputs';
import { UserIdParams } from './dtos/inputs/user_id.params';

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
    controller: usersController.simpleInfo,
  }),
);

/**
 * @description
 * 현재 로그인 된 사용자의 상세 정보 가져오기
 */
usersRouter.get(
  '/me/detail',
  handle({
    authLevel: 'must',
    controller: usersController.myDetailInfo,
  }),
);

/**
 * @description
 * 현재 로그인 된 사용자의 정보 수정하기
 */
usersRouter.patch(
  '/me',
  handle({
    authLevel: 'must',
    bodyCls: UpdateUserAvatarUrlBody,
    controller: usersController.update,
  }),
);

/**
 * @description
 * 현재 로그인 된 사용자 계정 삭제하기
 */
usersRouter.delete(
  '/me',
  handle({
    authLevel: 'must',
    controller: usersController.withdraw,
  }),
);

/**
 * USER MOVIE
 */
/**
 * @description
 * TODO:
 * 현재 로그인 한 사용자가 최근 조회한 영화(movie detail) 목록 조회(Pagination)
 */
//@ts-ignore
usersRouter.get('/me/movies/recent');
/**
 * @description
 * TODO:
 * 현재 로그인 한 사용자의 favorite 영화 목록 조회(Pagination)
 */
//@ts-ignore
usersRouter.get('/me/movies/favorite');

/**
 * USER REVIEW
 */
/**
 * @description
 * 현재 로그인 된 사용자가 작성한 영화 리뷰 보기
 */
// TODO: 정렬 추가
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
