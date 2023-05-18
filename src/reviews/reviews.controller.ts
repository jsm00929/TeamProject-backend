import reviewsService from './reviews.service';
import {ReviewIdParams} from './dtos/review_id.params';
import {AppError, RequestWith} from '../core/types';
import {AppResult} from '../core/types/app_result';
import {Request, Router} from "express";
import {handle} from "../core/handle";
import {MovieIdParams} from "../movies/dtos/inputs/get_movie_detail.params";
import {ErrorMessages} from "../core/enums/error_messages";
import {HttpStatus} from "../core/enums/http_status";
import reviewsRepository from "./reviews.repository";

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

/**
 * @description
 * AI PREDICT 조지기
 */
reviewsRouter.post(
    '/ai',
    async (req, res, next) => {

        if (req.query.code !== 'bummmjin') {
            res.json({
                message: ErrorMessages.NOT_FOUND_ENDPOINT,
                status: HttpStatus.NOT_FOUND,
            });
            return;
        }

        const {body} = req;
        await reviewsRepository.createReviewResult({
            result: body['result'],
            id: body['id'],
            movie_id: body['movie_id'],
        });

        res.json({
            message: 'ok',
        });
    },
);



