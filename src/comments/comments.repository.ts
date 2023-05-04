import { prisma } from '../config/db';
import { PaginationQuery } from '../core/dtos/inputs';
import { CreateMovieReviewCommentBody } from './dtos/inputs/create_movie_review_comment.body';
import { UpdateMovieReviewCommentBody } from './dtos/inputs/update_movie_review_comment.body';

/**
 * 조회
 */
async function findById(commentId: number) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  return comment === null || comment.deletedAt !== null ? null : comment;
}

async function findManyByReviewId(
  reviewId: number,
  { skip, take }: PaginationQuery,
) {
  return prisma.comment.findMany({
    where: {
      reviewId,
      deletedAt: null,
    },
    skip,
    take,
  });
}

async function findManyByAuthorId(
  authorId: number,
  { skip, take }: PaginationQuery,
) {
  return prisma.comment.findMany({
    where: {
      authorId,
      deletedAt: null,
    },
    skip,
    take,
  });
}

async function isExists(commentId: number) {
  const comment = await findById(commentId);
  return comment !== null;
}

async function isAuthor(userId: number, commentId: number) {
  const comment = await findById(commentId);
  return comment !== null && comment.authorId === userId;
}

/**
 * 생성 및 수정
 */
async function create(
  userId: number,
  reviewId: number,
  { content }: CreateMovieReviewCommentBody,
) {
  const { id } = await prisma.comment.create({
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

async function update(
  commentId: number,
  updateMovieCommentBody: UpdateMovieReviewCommentBody,
) {
  return prisma.comment.update({
    where: {
      id: commentId,
    },
    data: updateMovieCommentBody,
    select: {
      id: true,
    },
  });
}

async function remove(reviewId: number) {
  await prisma.comment.update({
    where: {
      id: reviewId,
    },
    data: {
      deletedAt: new Date(),
    },
  });
}

export default {
  findById,
  findManyByAuthorId,
  findManyByReviewId,
  isExists,
  isAuthor,
  create,
  update,
  remove,
};
