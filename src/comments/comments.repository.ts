import {
  PaginationQuery,
  PaginationQueryWithCursor,
} from '../core/dtos/inputs';
import { PickIdsWithTx } from '../core/types/pick_ids';
import { CreateReviewCommentBody } from './dtos/inputs/create_movie_review_comment.body';
import { UpdateReviewCommentBody } from './dtos/inputs/update_movie_review_comment.body';

/**
 * 조회
 */

// commentId로 조회
async function findById({ tx, commentId }: PickIdsWithTx<'comment'>) {
  const comment = tx.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  return comment;
}

// async function exists(commentId: number) {
//   const comment = await findById(commentId);
//   return comment !== null;
// }

// 댓글 작성자와 일치하는지 확인
async function isAuthor({
  tx,
  userId,
  commentId,
}: PickIdsWithTx<'user' | 'comment'>) {
  const comment = await findById({ tx, commentId });
  return comment !== null && comment.authorId === userId;
}

// reviewId로 리뷰 댓글 조회
async function findCommentsByReviewId(
  { tx, reviewId }: PickIdsWithTx<'review'>,
  { after, count }: PaginationQuery,
) {
  return await tx.comment.findMany({
    where: {
      reviewId: reviewId,
    },
    take: count,
    skip: after ? 1 : 0,
    ...(after && { cursor: { id: after } }),
  });
}

/**
 * 생성 및 수정
 */

async function createComment(
  { tx, userId, reviewId }: PickIdsWithTx<'user' | 'review'>,
  { content }: CreateReviewCommentBody,
) {
  const { id } = await tx.comment.create({
    data: {
      content,
      authorId: userId,
      reviewId,
    },
    select: {
      id: true,
    },
  });
  return id;
}

async function updateComment(
  { tx, commentId }: PickIdsWithTx<'comment'>,
  updateReviewCommentBody: UpdateReviewCommentBody,
) {
  return tx.comment.update({
    where: {
      id: commentId,
    },
    data: updateReviewCommentBody,
    select: {
      id: true,
    },
  });
}

async function removeComment({ tx, commentId }: PickIdsWithTx<'comment'>) {
  await tx.comment.update({
    where: {
      id: commentId,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}

export default {
  findCommentsByReviewId,
  createComment,
  updateComment,
  removeComment,
  findById,
  // exists,
  isAuthor,
  // create,
  // update,
  // remove,
};
