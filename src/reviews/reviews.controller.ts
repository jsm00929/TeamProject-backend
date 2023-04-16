import { HttpStatus } from '../core/constants/http_status';
import { PaginationQuery } from '../core/dtos/inputs/pagination.query';
import { CreateMovieReviewBody } from './dtos/create_movie_review.body';
import reviewsService from './reviews.service';
import { EditMovieReviewBody } from './dtos/edit_review.body';
import { ReviewIdParams } from './dtos/review_id.params';
import { AuthRequestWith, RequestWith } from '../core/types';
import { AppResult } from '../core/types/app_result';

async function getReviewDetail(req: RequestWith<never, ReviewIdParams>) {
  const { reviewId } = req.unwrapParams();
  const reviewDetail = await reviewsService.getReviewDetail(reviewId);

  return AppResult.new({ body: reviewDetail });
}

export default {};
