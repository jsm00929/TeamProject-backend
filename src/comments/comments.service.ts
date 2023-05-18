import { prisma } from "../config/db";
import { ErrorMessages } from "../core/constants";
import { AppError } from "../core/types";
import { PickIds } from "../core/types/pick_ids";
import reviewsRepository from "../reviews/reviews.repository";
import commentsRepository from "./comments.repository";
import { CommentsPaginationQuery } from "./dtos/inputs/comments_pagination.query";
import { CreateReviewCommentBody } from "./dtos/inputs/create_movie_review_comment.body";
import { UpdateReviewCommentBody } from "./dtos/inputs/update_movie_review_comment.body";

async function writeComment(
  { userId, reviewId }: PickIds<"user" | "review">,
  { content }: CreateReviewCommentBody
) {
  return prisma.$transaction(async (tx) => {
    const review = await reviewsRepository.findById({
      reviewId,
      tx,
    });

    if (review === null) {
      throw AppError.new({
        message: ErrorMessages.NOT_FOUND,
      });
    }

    const commentId = await commentsRepository.createComment(
      { tx, userId, reviewId },
      { content }
    );

    return commentId;
  });
}

async function Comments(
  { reviewId }: PickIds<"review">,
  q: CommentsPaginationQuery
) {
  return prisma.$transaction(async (tx) => {
    const { after, count } = q;

    const review = await reviewsRepository.findById({
      reviewId,
      tx,
    });

    if (review === null) {
      throw AppError.new({
        message: ErrorMessages.NOT_FOUND,
      });
    }

    const comments = await commentsRepository.findCommentsByReviewId(
      {
        tx,
        reviewId,
      },
      {
        after,
        count,
      }
    );

    return comments;
  });
}

async function editComment(
  { userId, commentId }: PickIds<"user" | "comment">,
  updateMovieReviewCommentBody: UpdateReviewCommentBody
) {
  return prisma.$transaction(async (tx) => {
    await commentsRepository.isAuthor({ tx, userId, commentId });
    const editedCommentId = await commentsRepository.updateComment(
      { tx, commentId },
      updateMovieReviewCommentBody
    );

    if (editedCommentId === null) {
      throw AppError.new({ message: ErrorMessages.NOT_FOUND });
    }
    return editedCommentId;
  });
}

async function deleteComment({
  userId,
  commentId,
}: PickIds<"user" | "comment">) {
  return prisma.$transaction(async (tx) => {
    await commentsRepository.isAuthor({ tx, userId, commentId });
    const deletedCommentId = await commentsRepository.removeComment({
      tx,
      commentId,
    });

    if (deletedCommentId === null) {
      throw AppError.new({ message: ErrorMessages.NOT_FOUND });
    }
  });
}

/**
 * EXPORT
 */

export default {
  writeComment,
  Comments,
  editComment,
  deleteComment,
};
