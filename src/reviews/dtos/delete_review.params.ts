import { IsNumber, Min } from 'class-validator';

export class DeleteReviewParams {
  @IsNumber()
  @Min(1)
  movieId: number;

  @IsNumber()
  @Min(1)
  reviewId: number;
}
