import reviewsService from './reviews.service';
import { ReviewIdParams } from './dtos/inputs/review_id.params';
import { RequestWith } from '../core/types';
import { AppResult } from '../core/types/app_result';

async function getReviewDetail(req: RequestWith<never, ReviewIdParams>) {
  const { reviewId } = req.unwrapParams();
  const reviewDetail = await reviewsService.getReviewDetail(reviewId);

  return AppResult.new({ body: reviewDetail });
}

export default {};
