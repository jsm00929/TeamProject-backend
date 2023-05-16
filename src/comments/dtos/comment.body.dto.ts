import { IsNumber, IsString } from 'class-validator';

export class CommentBody {
  @IsNumber()
  authorId: number;

  @IsString()
  content: string;

  // @IsNumber()
  // reviewId: number;
}
