import {Movie, MovieHistory} from '@prisma/client';
import {isNullOrDeleted} from "../../../utils/is_null_or_deleted";

export type MovieWithHistory = MovieHistory & { movie: Movie };

export class MovieHistoryOutput {
    id: number;
    movieId: number;
    title: string;
    overview: string;
    popularity: number;
    voteCount: number;
    voteAverage: number;
    backdropUrl: string | null;
    posterUrl: string | null;
    lang: string;
    releaseDate: Date | null;
    lastViewedAt: Date;

    protected constructor({id, lastViewedAt, movie: m}: MovieWithHistory) {
        this.id = id;
        this.movieId = m.id;
        this.title = m.title;
        this.overview = m.overview;
        this.popularity = m.popularity;
        this.voteCount = m.voteCount;
        this.voteAverage = m.voteAverage;
        this.backdropUrl = m.backdropUrl;
        this.posterUrl = m.posterUrl;
        this.lang = m.lang;
        this.releaseDate = m.releaseDate;
        this.lastViewedAt = lastViewedAt;
    }

    static from(m: MovieWithHistory): MovieHistoryOutput {
        return new this(m);
    }

    static nullOrFrom(m: MovieWithHistory | null): MovieHistoryOutput | null {
        return isNullOrDeleted(m) ? null : this.from(m!);
    }
}
