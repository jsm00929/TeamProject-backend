import reviewsService from './reviews.service';
import {ReviewIdParams} from './dtos/review_id.params';
import {RequestWith} from '../core/types';
import {AppResult} from '../core/types/app_result';
import {Router} from "express";
import {handle} from "../core/handle";
import {MovieIdParams} from "../movies/dtos/inputs/get_movie_detail.params";

export const reviewsRouter = Router();

// /**
//  * Movie Reviews
//  */
/**
 * @description
 * 특정 영화에 대한 리뷰 가져오기(Pagination)
 */
reviewsRouter.get(
    '/:movieId/reviews',
    handle({
        authLevel: 'must',
        paramsCls: MovieIdParams,
        controller: detail,
    }),
);

async function detail(req: RequestWith<never, ReviewIdParams>) {
    const {reviewId} = req.unwrapParams();
    const reviewDetail = await reviewsService.reviewDetail({reviewId});

    return AppResult.new({body: reviewDetail});
}

