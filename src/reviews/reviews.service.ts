import { ErrorMessages, HttpStatus } from '../core/constants';
import { PaginationQuery } from '../core/dtos/inputs';
import { AppError } from '../core/types';
import { CreateMovieReviewBody } from './dtos/inputs/create_movie_review.body';
import { EditMovieReviewBody } from './dtos/inputs/edit_review.body';
import reviewsRepository from './reviews.repository';

async function getReviewDetail(reviewId: number) {
  return reviewsRepository.findById(reviewId);
}

async function getReviewOverviewsByUserId(userId: number, q: PaginationQuery) {
  return reviewsRepository.findManyByAuthorId(userId, q);
}

async function write(
  userId: number,
  movieId: number,
  body: CreateMovieReviewBody,
) {
  return reviewsRepository.create(userId, movieId, body);
}

async function edit(
  userId: number,
  reviewId: number,
  body: EditMovieReviewBody,
) {
  const exists = await reviewsRepository.isExists(reviewId);
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

  await reviewsRepository.update(reviewId, body);
}

async function remove(userId: number, reviewId: number) {
  const exists = await reviewsRepository.isExists(reviewId);
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
