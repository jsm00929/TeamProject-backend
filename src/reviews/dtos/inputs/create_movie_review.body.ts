import { IsNotEmpty, IsNumber, Max, MaxLength, Min } from 'class-validator';

export class CreateMovieReviewBody {
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @MaxLength(1000)
  content: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  rating: number;
}
