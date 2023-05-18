import {IsEnum, IsIn, IsOptional, IsString,} from 'class-validator';
import {PaginationQuery} from '../../../core/dtos/inputs';
import {Genre} from '../genre.enum';

export enum MovieSortingCriteria {
    POPULARITY = 'popularity',
    RATING = 'voteAverage',
    RELEASE_DATE = 'releaseDate',
}

export class MoviesPaginationQuery extends PaginationQuery {
    @IsEnum(MovieSortingCriteria)
    criteria: MovieSortingCriteria;

    @IsEnum(Genre)
    genre: Genre;

    @IsIn(['desc', 'asc'])
    order: string;

    @IsOptional()
    @IsIn(['review'])
    @IsString()
    include?: string;

    constructor(
        after?: number,
        count?: number,
        criteria = MovieSortingCriteria.RELEASE_DATE,
        genre = Genre.ALL,
        order = 'desc',
        include = undefined,
    ) {
        super(after, count);
        this.criteria = criteria;
        this.genre = genre;
        this.order = order;
        this.include = include;
    }
}

enum UserMovieFilter {
    RECENTLY_VIEWED = 'recentlyViewed',
    FAVORITE = 'favorite',
}

export class UserMoviesPaginationQuery extends PaginationQuery {
    @IsEnum(UserMovieFilter)
    filter: UserMovieFilter;

    @IsOptional()
    @IsString()
    include?: string;

    constructor(
        after?: number,
        count?: number,
        filter = UserMovieFilter.RECENTLY_VIEWED,
    ) {
        super(after, count);
        this.filter = filter;
    }
}
