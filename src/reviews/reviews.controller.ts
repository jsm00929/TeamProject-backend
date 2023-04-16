import { HandlerResponse } from '../core/middlewares/handle_response';
import { HttpStatus } from '../core/constants/http_status';
import { PaginationQuery } from '../core/dtos/inputs/pagination.query';
import { CreateReviewInput } from './dtos/create_review.input';
import reviewsService from './reviews.service';
import { EditReviewInput } from './dtos/edit_review.input';
import { ReviewIdParams } from './dtos/review_id.params';
import { AuthRequestWith } from '../core/types';

async function getMyReviewOverviews(
  req: AuthRequestWith<PaginationQuery>,
): Promise<HandlerResponse> {
  const userId = req.userId;
  const paginationQuery = req.unwrap();

  const myReviews = await reviewsService.getReviewOverviewsByUserId(
    userId,
    paginationQuery,
  );

  return { body: myReviews };
}

async function write(
  req: AuthRequestWith<CreateReviewInput>,
): Promise<HandlerResponse> {
  const userId = req.userId;
  const createReviewInput = req.unwrap();

  const reviewId = await reviewsService.write(userId, createReviewInput);

  return {
    body: { reviewId },
    status: HttpStatus.CREATED,
  };
}

async function edit(req: AuthRequestWith<EditReviewInput, ReviewIdParams>) {
  const userId = req.userId;
  const editReviewInput = req.unwrap();
  const { reviewId } = req.unwrapParams();

  await reviewsService.edit(userId, reviewId, editReviewInput);
}

async function remove(req: AuthRequestWith<never, ReviewIdParams>) {
  const userId = req.userId;
  const { reviewId } = req.unwrapParams();

  await reviewsService.remove(userId, reviewId);
}

export default {
  getMyReviewOverviews,
  write,
  edit,
  remove,
};
