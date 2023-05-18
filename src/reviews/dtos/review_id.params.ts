import { IsNumber, Min } from "class-validator";

export class ReviewIdParams {
  @IsNumber()
  @Min(1)
  reviewId: number;
}
