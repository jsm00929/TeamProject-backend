import {isNullOrDeleted} from '../../../utils/is_null_or_deleted';
import {MovieWithGenres} from '../movie_with_genres';
import {LikeMovie} from "@prisma/client";

export type LikedMovie = LikeMovie & { movie: MovieWithGenres };

export class MovieWithGenresOutput {
    id: number;
    title: string;
    overview: string;
    popularity: number;
    voteCount: number;
    voteAverage: number;
    backdropUrl: string | null;
    posterUrl: string | null;
    lang: string;
    releaseDate: Date | null;
    isFavorite: boolean = false;
    isLiked: boolean = false;
    genres: string[];

    protected constructor(
        m: MovieWithGenres,
        isFavorite?: boolean | null,
        isLiked?: boolean | null,
    ) {
        this.id = m.id;
        this.title = m.title;
        this.overview = m.overview;
        this.popularity = m.popularity;
        this.voteCount = m.voteCount;
        this.voteAverage = m.voteAverage;
        this.backdropUrl = m.backdropUrl;
        this.posterUrl = m.posterUrl;
        this.lang = m.lang;
        this.releaseDate = m.releaseDate;
        this.isFavorite = isFavorite ?? false;
        this.isLiked = isLiked ?? false;
        this.genres = m.genres.map((genre) => genre.name);
    }

    public static nullOrFrom(
        m: MovieWithGenres | null,
        {
            isFavorite,
            isLiked,
        }: {
            isFavorite?: boolean | null;
            isLiked?: boolean | null;
        } = {isLiked: false, isFavorite: false},
    ): MovieWithGenresOutput | null {
        return isNullOrDeleted(m) ? null : this.from(m!, {isFavorite, isLiked});
    }

    public static from(
        m: MovieWithGenres,
        {
            isFavorite,
            isLiked,
        }: {
            isFavorite?: boolean | null;
            isLiked?: boolean | null;
        } = {isLiked: false, isFavorite: false},
    ): MovieWithGenresOutput {
        return new this(m, isFavorite, isLiked);
    }

    public static fromLikeMovie(
        m: LikedMovie,
        {
            isFavorite,
            isLiked,
        }: {
            isFavorite?: boolean | null;
            isLiked?: boolean | null;
        } = {isLiked: false, isFavorite: false},
    ): MovieWithGenresOutput {
        return new this(m.movie, isFavorite, isLiked);
    }
}
