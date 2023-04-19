import { IsNumber } from 'class-validator';

export class MovieIdParams {
  @IsNumber()
  movieId: number;
}
