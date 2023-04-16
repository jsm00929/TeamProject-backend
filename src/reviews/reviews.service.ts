import { ErrorMessages } from '../core/constants/error_messages';
import { HttpStatus } from '../core/constants/http_status';
import { PaginationQuery } from '../core/dtos/inputs/pagination.query';
import { AppError } from '../core/types/app_error';
import { CreateReviewInput } from './dtos/create_review.input';
import { EditReviewInput } from './dtos/edit_review.input';
import { ReviewOverviewOutput } from './dtos/review_overview.output';
import reviewsRepository from './reviews.repository';

async function getReviewOverviewsByUserId(
  userId: number,
  paginationQuery: PaginationQuery,
) {
  return reviewsRepository.getReviewOverviewsByUserId(userId, paginationQuery);
}

async function write(userId: number, createReviewInput: CreateReviewInput) {
  return reviewsRepository.create(userId, createReviewInput);
}

async function edit(
  userId: number,
  reviewId: number,
  editReviewInput: EditReviewInput,
) {
  const isMyReview = await reviewsRepository.isAuthor(userId, reviewId);
  if (!isMyReview) {
    throw AppError.create({
      message: ErrorMessages.PERMISSION_DENIED,
      status: HttpStatus.FORBIDDEN,
    });
  }

  await reviewsRepository.update(reviewId, editReviewInput);
}

async function remove(userId: number, reviewId: number) {
  const isMyReview = await reviewsRepository.isAuthor(userId, reviewId);
  if (!isMyReview) {
    throw AppError.create({
      message: ErrorMessages.PERMISSION_DENIED,
      status: HttpStatus.FORBIDDEN,
    });
  }
  await reviewsRepository.remove(userId);
}

export default {
  getReviewOverviewsByUserId,
  write,
  edit,
  remove,
};
