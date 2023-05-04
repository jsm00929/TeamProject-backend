import { PaginationQuery } from './filter.query';

export class PaginationQueryWith<T> extends PaginationQuery {
  filter: T;

  private constructor(skip: number, take: number, filter: T) {
    super(skip, take);
    this.filter = filter;
  }

  static create<T>({
    skip = 0,
    take = 20,
    filter,
  }: {
    skip?: number;
    take?: number;
    filter: T;
  }) {
    return new PaginationQueryWith<T>(skip, take, filter);
  }
}
