import { AppError } from '../core/types';
import commentsRepository from './comments.repository';
import { UpdateMovieReviewCommentBody } from './dtos/inputs/create_movie_review_comment.body';

async function write(
  userId: number,
  reviewId: number,
  createMovieReviewCommentBody: UpdateMovieReviewCommentBody,
) {
  return commentsRepository.create(
    userId,
    reviewId,
    createMovieReviewCommentBody,
  );
}

async function edit(
  userId: number,
  commentId: number,
  updateMovieReviewCommentBody: UpdateMovieReviewCommentBody,
) {
  const exists = await commentsRepository.exists(commentId);
  if (!exists) {
  }
  await commentsRepository.isAuthor(userId, commentId);
  await commentsRepository.update(commentId, updateMovieReviewCommentBody);
}

/**
 * EXPORT
 */

export default {
  write,
};
