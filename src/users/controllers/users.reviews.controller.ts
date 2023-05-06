import {AuthRequestWith, RequestWith} from "../../core/types";
import {PaginationQuery} from "../../core/dtos/inputs";
import {AppResult} from "../../core/types/app_result";
import {UserIdParams} from "../dtos/inputs/user_id.params";
import reviewsService from "../../reviews/reviews.service";

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

    const reviews = await reviewsService.reviewOverviewsByUserId({
        userId,
        after,
        count,
    });

    return AppResult.new({body: reviews});
}

