import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMovieCommentBody {
  @IsString()
  @IsNotEmpty()
  content: string;
}
