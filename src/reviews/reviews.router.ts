import { Router } from 'express';
import { PaginationQuery } from '../core/dtos/inputs';
import { handle, handleResponse, mustValidQuery } from '../core/middlewares';
import { mustAuth } from '../auth/middlewares/must_auth';
import reviewsController from './reviews.controller';
import { CreateReviewInput } from './dtos/create_review.input';
import { ReviewIdParams } from './dtos/review_id.params';
import { EditReviewInput } from './dtos/edit_review.input';
import { AuthRequestWith } from '../core/types';

const reviewsRouter = Router();

reviewsRouter.get(
  '/',
  mustValidQuery(PaginationQuery),
  mustAuth,
  handleResponse(reviewsController.getMyReviewOverviews),
);

reviewsRouter.post(
  '/',
  handle({
    authLevel: 'must',
    bodyCls: CreateReviewInput,
    controller: reviewsController.write,
  }),
);

reviewsRouter.patch(
  '/',
  handle({
    authLevel: 'must',
    bodyCls: EditReviewInput,
    paramsCls: ReviewIdParams,
    controller: reviewsController.edit,
  }),
  // mustValid(EditReviewInput, ReviewIdParams),
  // mustAuth,
  // handleResponse<AuthRequestWith<EditReviewInput, ReviewIdParams>>(
  //   reviewsController.edit,
  // ),
);

reviewsRouter.delete(
  '/:reviewId',
  handle({
    paramsCls: ReviewIdParams,
    controller: reviewsController.remove,
  }),
);

export default reviewsRouter;
