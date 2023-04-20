import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMovieReviewCommentBody {
  @IsString()
  @IsNotEmpty()
  content: string;
}
