import { prisma } from '../config/db';
import { reviewRepository } from '../reviews/reviews.repository';
import { AppError } from '../types/AppError';
import { ErrorMessages } from '../types/ErrorMessages';
import { HttpStatus } from '../types/HttpStatus';
import { commentsRepository } from './comments.repository';

export const commentService = {
  async createComment(createComment) {
    return await prisma.$transaction(async (tx) => {
      // 댓글 달 리뷰가 없는 경우
      const review = await reviewRepository.findReviewById(
        tx,
        createComment.reviewId,
      );
      if (review == null) {
        throw AppError.create({
          message: '댓글 달 리뷰 없음',
          status: HttpStatus.BAD_REQUEST,
        });
      }

      return await commentsRepository.createComment(createComment, tx);
    });
  },

  async getComments(reviewId: number, lastId: number) {
    return prisma.$transaction(async (tx) => {
      const comments = await commentsRepository.findCommentsByReviewId(
        tx,
        reviewId,
        lastId,
      );

      return comments;
    });
  },

  async updateComment(updateComment) {
    return await prisma.$transaction(async (tx) => {
      const comment = await commentsRepository.updateComment(updateComment, tx);

      // 수정하려는 댓글이 없는 경우
      const existedComment = await commentsRepository.findCommentByCommentId(
        tx,
        updateComment.commentId,
      );
      if (existedComment === null) {
        throw AppError.create({
          message: ErrorMessages.COMMENT_NOT_FOUND,
        });
      }
      return comment;
    });
  },

  async deleteComment(commentId: number) {
    return prisma.$transaction(async (tx) => {
      const comment = await commentsRepository.removeComment(tx, commentId);
      return comment;
    });
  },
};
