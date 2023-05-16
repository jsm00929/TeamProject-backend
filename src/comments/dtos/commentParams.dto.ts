import { IsNumber } from 'class-validator';

export class CommentParams {
  @IsNumber()
  reviewId: number;

  @IsNumber()
  commentId?: number;
}
