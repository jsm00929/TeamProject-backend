import { PaginationQuery } from '../../../core/dtos/inputs';
import { IsEnum } from 'class-validator';
import { SortingOrder } from '../../../core/types/sorting_order';
import { Genre } from '../genre';

enum MovieSortingCriteria {
  POPULARITY = 'popularity',
  RATING = 'voteAverage',
  RELEASE_DATE = 'releaseDate',
}

export class MoviesPaginationQuery extends PaginationQuery {
  @IsEnum(MovieSortingCriteria)
  criteria: MovieSortingCriteria;

  @IsEnum(SortingOrder)
  order: SortingOrder;

  @IsEnum(Genre)
  genre: Genre;

  constructor(
    take?: number,
    skip?: number,
    criteria = MovieSortingCriteria.RELEASE_DATE,
    order = SortingOrder.DESCENDING,
    genre = Genre.ALL,
  ) {
    super(take, skip);
    this.criteria = criteria;
    this.order = order;
    this.genre = genre;
  }
}
