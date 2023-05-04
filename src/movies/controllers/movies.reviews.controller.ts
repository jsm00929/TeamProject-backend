/**
 * Movie Reviews
 */
import {AuthRequestWith, RequestWith} from "../../core/types";
import {CreateMovieReviewBody} from "../../reviews/dtos/create_movie_review.body";
import {MovieIdParams} from "../dtos/inputs/get_movie_detail.params";
import reviewsService from "../../reviews/reviews.service";
import {AppResult} from "../../core/types/app_result";
import {HttpStatus} from "../../core/constants";
import {EditMovieReviewBody} from "../../reviews/dtos/edit_review.body";
import {ReviewIdParams} from "../../reviews/dtos/review_id.params";
import {Router} from "express";
import {handle} from "../../core/handle";

export const moviesReviewsRouter = Router();

/**
 * @description
 * 특정 영화에 대한 리뷰 작성하기
 */
moviesReviewsRouter.post(
    '/:movieId/reviews',
    handle({
        authLevel: 'must',
        bodyCls: CreateMovieReviewBody,
        paramsCls: MovieIdParams,
        controller: write,
    }),
);

async function write(
    req: AuthRequestWith<CreateMovieReviewBody, MovieIdParams>,
) {
    const {userId} = req;
    const {movieId} = req.unwrapParams();
    const body = req.unwrap();

    const reviewId = await reviewsService.write(
        {
            userId,
            movieId,
        },
        body,
    );

    return AppResult.new({
        body: {reviewId},
        status: HttpStatus.CREATED,
    });
}

/**
 * @description
 * 특정 영화 리뷰 삭제하기
 */
moviesReviewsRouter.delete(
    '/reviews/:reviewId',
    handle({
        authLevel: 'must',
        paramsCls: ReviewIdParams,
        controller: remove,
    }),
);

async function edit(
    req: AuthRequestWith<EditMovieReviewBody, ReviewIdParams>,
) {
    const userId = req.userId;
    const editReviewInput = req.unwrap();
    const {reviewId} = req.unwrapParams();

    await reviewsService.edit({userId, reviewId}, editReviewInput);
}


/**
 * @description
 * 특정 영화 리뷰 삭제하기
 */
moviesReviewsRouter.delete(
    '/reviews/:reviewId',
    handle({
        authLevel: 'must',
        paramsCls: ReviewIdParams,
        controller: remove,
    }),
)

async function remove(req: AuthRequestWith<never, ReviewIdParams>) {
    const userId = req.userId;
    const {reviewId} = req.unwrapParams();

    await reviewsService.remove({userId, reviewId});
}

/**
 * @description
 * 영화 상세 정보 조회
 * 로그인 된 상태로 조회 시, Movie History 자동 추가
 */
moviesReviewsRouter.get(
    '/:movieId/reviews/:reviewId',
    handle({
        paramsCls: MovieIdParams,
        controller: detail,
    }),
);

async function detail(req: RequestWith<never, ReviewIdParams>) {
    const {reviewId} = req.unwrapParams();
    const reviewDetail = await reviewsService.getReviewDetail({reviewId});

    return AppResult.new({body: reviewDetail});
}
