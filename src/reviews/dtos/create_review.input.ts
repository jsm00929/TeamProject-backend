import { IsNotEmpty, IsNumber, Max, MaxLength, Min } from 'class-validator';

export class CreateReviewInput {
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @MaxLength(1000)
  content: string;

  @IsNumber()
  @Min(0.0)
  @Max(5.0)
  rating: number;
}
