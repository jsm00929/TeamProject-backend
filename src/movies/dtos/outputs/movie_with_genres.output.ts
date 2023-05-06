import {isNullOrDeleted} from "../../../utils/is_null_or_deleted";
import {MovieWithGenres} from "../movie_with_genres";

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
    genres: string[];

    protected constructor(m: MovieWithGenres) {
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
        this.genres = m.genres.map((genre) => genre.name);
    }

    public static nullOrFrom(
        m: MovieWithGenres | null,
    ): MovieWithGenresOutput | null {
        return isNullOrDeleted(m) ? null : this.from(m!);
    }

    public static from(m: MovieWithGenres): MovieWithGenresOutput {
        return new MovieWithGenresOutput(m);
    }


}

