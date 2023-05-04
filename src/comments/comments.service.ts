import commentsRepository from './comments.repository';
import { PaginationQuery } from '../core/dtos/inputs';
import { UpdateMovieReviewCommentBody } from './dtos/inputs/update_movie_review_comment.body';
import { AppError } from '../core/types';
import { ErrorMessages, HttpStatus } from '../core/constants';

async function getReviewCommentsByUserId(userId: number, q: PaginationQuery) {
  return commentsRepository.findManyByAuthorId(userId, q);
}

async function getReviewComments(reviewId: number, q: PaginationQuery) {
  return commentsRepository.findManyByReviewId(reviewId, q);
}

async function write(
  userId: number,
  reviewId: number,
  b: UpdateMovieReviewCommentBody,
) {
  return commentsRepository.create(userId, reviewId, b);
}

async function edit(
  userId: number,
  commentId: number,
  b: UpdateMovieReviewCommentBody,
) {
  const exists = await commentsRepository.isExists(commentId);
  if (!exists) {
    throw AppError.new({
      message: ErrorMessages.NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }
  await commentsRepository.isAuthor(userId, commentId);
  await commentsRepository.update(commentId, b);
}

async function remove(userId: number, commentId: number) {
  const comment = await commentsRepository.findById(commentId);
  if (!comment) {
    throw AppError.new({
      message: ErrorMessages.NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }

  if (comment.authorId !== userId) {
    throw AppError.new({
      message: ErrorMessages.PERMISSION_DENIED,
      status: HttpStatus.UNAUTHORIZED,
    });
  }

  await commentsRepository.remove(commentId);
}

/**
 * EXPORT
 */

export default {
  getReviewCommentsByUserId,
  getReviewComments,
  write,
  edit,
  remove,
};
