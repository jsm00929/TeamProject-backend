import { Max, Min } from 'class-validator';

export class PaginationQuery {
  @Min(0)
  skip: number;

  @Min(10)
  @Max(100)
  take: number;

  constructor(skip = 0, take = 20) {
    this.skip = skip;
    this.take = take;
  }
}
