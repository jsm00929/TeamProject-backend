import { Response, NextFunction } from 'express';
import { AppError } from '../types/AppError';
import { CustomRequest } from '../types/CustomRequest';
import { ErrorMessages } from '../types/ErrorMessages';
import { HttpStatus } from '../types/HttpStatus';
import { commentService } from './comments.service';
import { CommentBody } from './dtos/comment.body.dto';

export const commentController = {
  async createComment(
    req: CustomRequest<CommentBody>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { reviewId } = req.params;
      const { authorId, content } = req.body;

      console.log(parseInt(reviewId as string, 10));
      const createdComment = await commentService.createComment({
        reviewId: parseInt(reviewId as string, 10),
        authorId,
        content,
      });
      res.json(createdComment);
    } catch (error) {
      console.log(error);
      next(error);
    }
  },

  async getComments(req, res, next) {
    try {
      const lastId = Number(req.query.lastId ?? 0);
      const { reviewId } = req.query;

      const comments = await commentService.getComments(reviewId, lastId);
      return comments;
    } catch (error) {
      next(error);
    }
  },

  async updateComment(req, res, next) {
    try {
      const { commentId } = req.query;
      const commentContent = req.body;

      const updatedComment = await commentService.updateComment({
        commentId,
        commentContent,
      });
      res.json(updatedComment);
    } catch (error) {
      next(error);
    }
  },

  async deleteComment(req, res, next) {
    try {
      const commentId = req.query;
      const deletedComment = await commentService.deleteComment(commentId);
      res.json(deletedComment);
    } catch (error) {
      next(error);
    }
  },
};
