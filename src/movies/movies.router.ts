import { Router } from 'express';
import moviesController from './movies.controller';
import { PaginationQuery } from '../core/dtos/inputs/pagination.query';
import { MovieIdParams } from './dtos/inputs/get_movie_detail.params';
import { handle } from '../core/handle';
import { CreateMovieReviewBody } from '../reviews/dtos/create_movie_review.body';
import { EditMovieReviewBody } from '../reviews/dtos/edit_review.body';
import { ReviewIdParams } from '../reviews/dtos/review_id.params';

/**
 * BASE_URL: /api/movies
 */
const moviesRouter = Router();

/**
 * 조회
 */
/**
 * @description
 * 유명 영화 순으로 가져오기(Pagination)
 */
moviesRouter.get(
  '/popular',
  handle({
    queryCls: PaginationQuery,
    controller: moviesController.getPopularMovies,
  }),
);

/**
 * @description
 * 영화 id로 detail 정보 가져오기
 */
moviesRouter.get(
  '/detail/:movieId',
  handle({
    paramsCls: MovieIdParams,
    controller: moviesController.getMovieDetail,
  }),
);

/**
 * Movie Reviews
 */
/**
 * @description
 * 특정 영화에 대한 리뷰 가져오기(Pagination)
 */
moviesRouter.post(
  '/:movieId/reviews',
  handle({
    authLevel: 'must',
    bodyCls: CreateMovieReviewBody,
    controller: moviesController.writeReview,
  }),
);

/**
 * 생성 및 수정
 */
/**
 * @description
 * 특정 영화에 대한 리뷰 작성하기
 */
moviesRouter.post(
  '/:movieId/reviews',
  handle({
    authLevel: 'must',
    bodyCls: CreateMovieReviewBody,
    paramsCls: ReviewIdParams,
    controller: moviesController.writeReview,
  }),
);

/**
 * @description
 * 특정 영화 리뷰 수정하기
 */
moviesRouter.patch(
  '/reviews/:reviewId',
  handle({
    authLevel: 'must',
    bodyCls: EditMovieReviewBody,
    paramsCls: ReviewIdParams,
    controller: moviesController.editReview,
  }),
);

/**
 * @description
 * 특정 영화 리뷰 삭제하기
 */
moviesRouter.delete(
  '/reviews/:reviewId',
  handle({
    authLevel: 'must',
    paramsCls: ReviewIdParams,
    controller: moviesController.removeReview,
  }),
);

export default moviesRouter;
