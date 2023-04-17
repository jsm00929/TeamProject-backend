import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMovieReviewCommentBody {
  @IsString()
  @IsNotEmpty()
  content: string;
}
