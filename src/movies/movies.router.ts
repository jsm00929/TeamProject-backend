// import {Router} from 'express';
// import moviesController from './controllers/movies.controller';
// import {MovieIdParams} from './dtos/inputs/get_movie_detail.params';
// import {handle} from '../core/handle';
// import {CreateMovieReviewBody} from '../reviews/dtos/create_movie_review.body';
// import {EditMovieReviewBody} from '../reviews/dtos/edit_review.body';
// import {ReviewIdParams} from '../reviews/dtos/review_id.params';
// import {MoviesPaginationQuery} from './movies_pagination.query';
// import moviesReviewsController from "./controllers/movies.reviews.controller";
//
// /**
//  * BASE_URL: /api/movies
//  */
// const moviesRouter = Router();
//
// /**
//  * Movies
//  */
// /**
//  * @description
//  * 유명 영화 순으로 가져오기(Pagination)
//  */
// moviesRouter.get(
//     '/',
//     handle({
//         queryCls: MoviesPaginationQuery,
//         controller: moviesController.movies,
//     }),
// );
// /**
//  * @description
//  * 유명 영화 순으로 가져오기(Pagination)
//  */
//
// /**
//  * @description
//  * 영화 id로 detail 정보 가져오기
//  */
// // moviesRouter.get(
// //     '/detail/:movieId',
// //     handle({
// //         paramsCls: MovieIdParams,
// //         controller: detail,
// //     }),
// // );
// //
//
// /**
//  * Movie Reviews
//  */
// /**
//  * @description
//  * 특정 영화에 대한 리뷰 가져오기(Pagination)
//  */
// // moviesRouter.get(
// //   '/:movieId/reviews',
// //   handle({
// //     authLevel: 'must',
// //     paramsCls: MovieIdParams,
// //     controller: moviesController.getMovieDetail,
// //   }),
// // );
//
// /**
//  * @description
//  * 특정 영화에 대한 리뷰 작성하기
//  */
// moviesRouter.post(
//     '/:movieId/reviews',
//     handle({
//         authLevel: 'must',
//         bodyCls: CreateMovieReviewBody,
//         paramsCls: MovieIdParams,
//         controller: moviesReviewsController.write,
//     }),
// );
//
// /**
//  * @description
//  * 특정 영화 리뷰 수정하기
//  */
// moviesRouter.patch(
//     '/reviews/:reviewId',
//     handle({
//         authLevel: 'must',
//         bodyCls: EditMovieReviewBody,
//         paramsCls: ReviewIdParams,
//         controller: moviesReviewsController.edit,
//     }),
// );
//
// /**
//  * @description
//  * 특정 영화 리뷰 삭제하기
//  */
// moviesRouter.delete(
//     '/reviews/:reviewId',
//     handle({
//         authLevel: 'must',
//         paramsCls: ReviewIdParams,
//         controller: moviesReviewsController.remove,
//     }),
// );
//
// export default moviesRouter;
