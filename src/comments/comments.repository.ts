import { prisma } from '../config/db';
import { CommentBody } from './dtos/comment.body.dto';

export const commentsRepository = {
  async createComment(tx, commentInfo) {
    return await tx.comment.create({
      data: {
        authorId: commentInfo.authorId,
        content: commentInfo.content,
        reviewId: commentInfo.reviewId,
      },
    });
  },

  // 리뷰에 달린 댓글 조회
  async findCommentsByReviewId(tx, reviewId: number, lastId?: number) {
    return await tx.comment.findMany({
      where: {
        reviewId: reviewId,
      },
      take: 5,
      skip: lastId ? 1 : 0,
      ...(lastId && { cursor: { id: lastId } }),
    });
  },

  async findCommentByCommentId(tx, commentId: number) {
    return await tx.comment.findUnique({
      where: {
        id: commentId,
      },
    });
  },

  async updateComment(tx, commentInfo) {
    return await tx.comment.update({
      where: {
        id: commentInfo.commentId,
      },
      data: {
        content: commentInfo.content,
      },
    });
  },

  // async deleteComment(commentId) {
  //   const comment = await prisma.comment.delete({
  //     where: commentId,
  //   });
  //   return comment;
  // },

  // soft delete
  async removeComment(tx, commentId: number) {
    await tx.comment.update({
      where: {
        id: commentId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};
