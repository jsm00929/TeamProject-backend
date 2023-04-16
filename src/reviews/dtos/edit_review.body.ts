import { Max, MaxLength, Min } from 'class-validator';

export class EditMovieReviewBody {
  @MaxLength(100)
  title?: string;

  @MaxLength(1000)
  content?: string;

  @Min(0.0)
  @Max(5.0)
  rating?: number;
}
