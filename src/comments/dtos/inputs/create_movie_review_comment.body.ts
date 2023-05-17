import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReviewCommentBody {
  @IsString()
  @IsNotEmpty()
  content: string;
}
