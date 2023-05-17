import { Router } from 'express';
import { ErrorMessages, HttpStatus } from '../core/constants';
import { handle } from '../core/handle';
import { AppError, AuthRequestWith, RequestWith } from '../core/types';
import { AppResult } from '../core/types/app_result';
import { ReviewIdParams } from '../reviews/dtos/review_id.params';
import commentsService from './comments.service';
import { CommentIdParams } from './dtos/inputs/comment_id.params';
import { CreateReviewCommentBody } from './dtos/inputs/create_movie_review_comment.body';
import { UpdateReviewCommentBody } from './dtos/inputs/update_movie_review_comment.body';

export const commentRouter = Router();

// 댓글 생성
commentRouter.post(
  '/:reviewId/comment',
  handle({
    authLevel: 'must',
    paramsCls: ReviewIdParams,
    bodyCls: CreateReviewCommentBody,
    controller: writeComment,
  }),
);

async function writeComment(
  req: AuthRequestWith<CreateReviewCommentBody, ReviewIdParams>,
) {
  try {
    const { userId } = req;
    const { reviewId } = req.unwrapParams();
    const { content } = req.unwrap();

    const commentId = await commentsService.writeComment(
      { userId, reviewId },
      { content },
    );

    return AppResult.new({
      body: commentId,
      status: HttpStatus.CREATED,
    });
  } catch (error) {
    throw Error(error);
    // throw AppError.new({
    //   message: ErrorMessages.
    // });
  }
}

// 댓글 전체 조회
commentRouter.get(
  '/:reviewId/comment',
  handle({
    paramsCls: ReviewPaginationQuery,
    controller: reviewComments,
  }),
);

async function reviewComments(req: RequestWith<ReviewPaginationQuery>) {
  try {
    const q = req.unwrapParams();
    const comments = await commentsService.Comments(q);

    return AppResult.new({
      body: comments,
    });
  } catch (error) {
    throw Error(error);
  }
}

// 댓글 수정
commentRouter.patch(
  '/:reviewId/comment/:commentId',
  handle({
    authLevel: 'must',
    paramsCls: CommentIdParams,
    bodyCls: UpdateReviewCommentBody,
    controller: editComment,
  }),
);

async function editComment(
  req: AuthRequestWith<UpdateReviewCommentBody, CommentIdParams>,
) {
  try {
    const { userId } = req;
    const { commentId } = req.unwrapParams();
    const { content } = req.unwrap();

    const editedCommentId = await commentsService.editComment(
      { userId, commentId },
      { content },
    );
    return AppResult.new({
      body: editedCommentId,
    });
  } catch (error) {
    throw Error(error);
  }
}

// 댓글 삭제
commentRouter.delete(
  '/:reviewId/comment/:commentId',
  handle({
    authLevel: 'must',
    paramsCls: CommentIdParams,
    controller: deleteComment,
  }),
);

async function deleteComment(req: AuthRequestWith<CommentIdParams>) {
  try {
    const { userId } = req;
    const { commentId } = req.unwrapParams();

    await commentsService.deleteComment({ userId, commentId });
  } catch (error) {
    throw Error(error);
  }
}
