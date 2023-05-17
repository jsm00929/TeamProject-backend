import { IsNumber, Min } from 'class-validator';

export class CommentIdParams {
  @IsNumber()
  @Min(1)
  commentId: number;
}
