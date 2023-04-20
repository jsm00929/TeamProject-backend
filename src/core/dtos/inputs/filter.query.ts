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

// export class PaginationWith<T> extends PaginationDto {
//   options: T;

//   private constructor(skip: number, take: number, options: T) {
//     super(skip, take);
//     this.options = options;
//   }

//   static create<T>({
//     skip = 0,
//     take = 20,
//     options,
//   }: {
//     skip?: number;
//     take?: number;
//     options: T;
//   }) {
//     return new PaginationWith<T>(skip, take, options);
//   }
// }
