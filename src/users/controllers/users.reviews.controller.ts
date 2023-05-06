import {AuthRequestWith, RequestWith} from "../../core/types";
import {PaginationQuery} from "../../core/dtos/inputs";
import {AppResult} from "../../core/types/app_result";
import {UserIdParams} from "../dtos/inputs/user_id.params";
import reviewsService from "../../reviews/reviews.service";
import {handle} from "../../core/handle";
import {Router} from "express";

export const usersMovieReviewsRouter = Router();
/**
 * @description
 * 현재 로그인 된 사용자가 작성한 리뷰 조회하기
 */
usersMovieReviewsRouter.get(
    '/me/reviews',
    handle({
        authLevel: 'must',
        queryCls: PaginationQuery,
        controller: myReviews,
    }),
);

async function myReviews(
    req: AuthRequestWith<PaginationQuery>,
) {
    const {userId} = req;
    const p = req.unwrap();

    const reviews = await reviewsService.reviewsByUserId({userId}, p);

    return AppResult.new({body: reviews});
}


/**
 * @description
 * 특정 사용자가(id로 조회) 작성한 리뷰 조회하기
 */
usersMovieReviewsRouter.get(
    '/:userId/reviews',
    handle({
        queryCls: PaginationQuery,
        paramsCls: UserIdParams,
        controller: reviews,
    }),
);

async function reviews(
    req: RequestWith<PaginationQuery, UserIdParams>,
) {
    const {userId} = req.unwrapParams();
    const p = req.unwrap();

    const reviews = await reviewsService.reviewsByUserId({userId}, p);

    return AppResult.new({body: reviews});
}




