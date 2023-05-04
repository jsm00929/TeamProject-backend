import { CreateMovieReviewCommentBody } from './dtos/inputs/create_movie_review_comment.body';
import { AuthRequestWith, RequestWith } from '../core/types';
import commentsService from './comments.service';
import { AppResult } from '../core/types/app_result';
import { HttpStatus } from '../core/constants';
import { PaginationQuery } from '../core/dtos/inputs';
import { UpdateMovieReviewCommentBody } from './dtos/inputs/update_movie_review_comment.body';
import { CommentIdParams } from './dtos/inputs/comment_id.params';
import { ReviewIdParams } from '../reviews/dtos/inputs/review_id.params';

/**
 * Query
 */

async function getReviewComments(
  req: RequestWith<PaginationQuery, ReviewIdParams>,
) {
  const query = req.unwrap();
  const { reviewId } = req.unwrapParams();
  const comments = await commentsService.getReviewComments(reviewId, query);

  return AppResult.new({
    body: comments,
  });
}

async function getMyReviewComments(
  req: AuthRequestWith<PaginationQuery, ReviewIdParams>,
) {
  const { userId } = req;
  const q = req.unwrap();
  const myComments = await commentsService.getReviewCommentsByUserId(userId, q);

  return AppResult.new({
    body: myComments,
  });
}

/**
 * Mutation
 */
async function write(
  req: AuthRequestWith<CreateMovieReviewCommentBody, ReviewIdParams>,
) {
  const { userId } = req;
  const { reviewId } = req.unwrapParams();
  const body = req.unwrap();
  const comment = await commentsService.write(userId, reviewId, body);

  return AppResult.new({
    body: comment,
    status: HttpStatus.CREATED,
  });
}

async function edit(
  req: AuthRequestWith<UpdateMovieReviewCommentBody, CommentIdParams>,
) {
  const { userId } = req;
  const { commentId } = req.unwrapParams();
  const body = req.unwrap();
  await commentsService.edit(userId, commentId, body);

  return AppResult.new({
    status: HttpStatus.OK,
  });
}

async function remove(req: AuthRequestWith<never, CommentIdParams>) {
  const { userId } = req;
  const { commentId } = req.unwrapParams();
  await commentsService.remove(userId, commentId);

  return AppResult.new({
    status: HttpStatus.OK,
  });
}

export default {
  getReviewComments,
  getMyReviewComments,
  write,
  edit,
  remove,
};
