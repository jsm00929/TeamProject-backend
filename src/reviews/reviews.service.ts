import { ErrorMessages } from '../core/constants/error_messages';
import { HttpStatus } from '../core/constants/http_status';
import { PaginationQuery } from '../core/dtos/inputs/pagination.query';
import { AppError } from '../core/types/app_error';
import { CreateMovieReviewBody } from './dtos/create_movie_review.body';
import { EditMovieReviewBody } from './dtos/edit_review.body';
import reviewsRepository from './reviews.repository';

async function getReviewDetail(reviewId: number) {
  return reviewsRepository.findById(reviewId);
}

async function getReviewOverviewsByUserId(
  userId: number,
  paginationQuery: PaginationQuery,
) {
  return reviewsRepository.getReviewOverviewsByUserId(userId, paginationQuery);
}

async function write(
  userId: number,
  movieId: number,
  createReviewInput: CreateMovieReviewBody,
) {
  return reviewsRepository.create(userId, movieId, createReviewInput);
}

async function edit(
  userId: number,
  reviewId: number,
  editReviewInput: EditMovieReviewBody,
) {
  const exists = await reviewsRepository.exists(reviewId);
  if (!exists) {
    throw AppError.new({
      message: ErrorMessages.NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }

  const isAuthor = await reviewsRepository.isAuthor(userId, reviewId);
  if (!isAuthor) {
    throw AppError.new({
      message: ErrorMessages.PERMISSION_DENIED,
      status: HttpStatus.FORBIDDEN,
    });
  }

  await reviewsRepository.update(reviewId, editReviewInput);
}

async function remove(userId: number, reviewId: number) {
  const exists = await reviewsRepository.exists(reviewId);
  if (!exists) {
    throw AppError.new({
      message: ErrorMessages.NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }

  const isAuthor = await reviewsRepository.isAuthor(userId, reviewId);
  if (!isAuthor) {
    throw AppError.new({
      message: ErrorMessages.PERMISSION_DENIED,
      status: HttpStatus.FORBIDDEN,
    });
  }

  await reviewsRepository.remove(reviewId);
}

export default {
  getReviewOverviewsByUserId,
  getReviewDetail,
  write,
  edit,
  remove,
};
