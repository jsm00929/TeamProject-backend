import { Router } from 'express';
import { isValid } from '../middlewares/isValid';
import { commentController } from './comments.controller';
import { CommentBody } from './dtos/comment.body.dto';

export const commentRouter = Router();

// 댓글 생성
commentRouter.post(
  '/:reviewId/comment',
  isValid(CommentBody, 'body'),
  commentController.createComment,
);

// 댓글 전체 조회
commentRouter.get(
  '/:reviewId/comment',
  isValid(CommentBody, 'params'),
  commentController.getComments,
);

// 댓글 수정
commentRouter.post(
  '/:reviewId/comment/:commentId',
  isValid(CommentBody, 'body'),
  commentController.updateComment,
);

// 댓글 삭제
commentRouter.delete(
  '/:reviewId/comment/:commentId',
  isValid(CommentBody, 'params'),
  commentController.deleteComment,
);
