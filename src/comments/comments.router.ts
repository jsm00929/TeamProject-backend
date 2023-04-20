import { Router } from 'express';
import { handle } from '../core/handle';
import commentsController from './comments.controller';
import { ReviewIdParams } from '../reviews/dtos/inputs/review_id.params';
import { PaginationQuery } from '../core/dtos/inputs';

const commentsRouter = Router();

/**
 * @description
 * 현재 로그인 된 사용자의 댓글 가져오기
 */
commentsRouter.get(
  '/me/movies/reviews/comments',
  handle({
    authLevel: 'must',
    queryCls: PaginationQuery,
    controller: commentsController.getMyReviewComments,
  }),
);

/**
 * @description
 * 특정 review에 대한 댓글 가져오기
 */
commentsRouter.get(
  '/me/movies/reviews/:reviewId/comments',
  handle({
    paramsCls: ReviewIdParams,
    queryCls: PaginationQuery,
    controller: commentsController.getMyReviewComments,
  }),
);
