import {Movie} from '@prisma/client';
import {isNullOrDeleted} from '../../../utils/is_null_or_deleted';

export class MovieOutput {
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

    protected constructor(
        m: Movie,
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
    }

    static from(
        m: Movie,
        {isFavorite, isLiked}:
            {
                isFavorite?: boolean | null,
                isLiked?: boolean | null,
            } = {isLiked: false, isFavorite: false},
    ): MovieOutput {
        return new MovieOutput(m, isFavorite, isLiked);
    }

    static nullOrFrom(
        m: Movie | null,
        {isFavorite, isLiked}:
            {
                isFavorite?: boolean | null,
                isLiked?: boolean | null,
            } = {isLiked: false, isFavorite: false},
    ): MovieOutput | null {
        return isNullOrDeleted(m) ? null : this.from(m!, {isFavorite, isLiked});
    }
}
