import {Genre, Movie} from '@prisma/client';

export type MovieWithGenres = (Movie & { genres: Genre[] });

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

    protected constructor(
        {
            id,
            title,
            overview,
            popularity,
            voteCount,
            voteAverage,
            backdropUrl,
            posterUrl,
            lang,
            releaseDate,
        }: Movie) {
        this.id = id;
        this.title = title;
        this.overview = overview;
        this.popularity = popularity;
        this.voteCount = voteCount;
        this.voteAverage = voteAverage;
        this.backdropUrl = backdropUrl;
        this.posterUrl = posterUrl;
        this.lang = lang;
        this.releaseDate = releaseDate;
    }

    public static from(m: Movie): MovieOutput {
        return new MovieOutput(m);
    }
}

export class MovieWithGenresOutput extends MovieOutput {
    genres: string[];

    private constructor(movieWithGenres: MovieWithGenres) {
        super(movieWithGenres);
        this.genres = movieWithGenres.genres.map((genre) => genre.name);
    }

    public static from(data: MovieWithGenres): MovieWithGenresOutput {
        return new MovieWithGenresOutput(data);
    }
}

// {
//   movieId: 1,
//   reviewId: 10,
//   evaluation: 0.12,
// }

// new Map({
//   1: 긍정적,
//   2: 부정적,
// })

// /movie/1
// res.json ({
//   title: '1',
//   eval: '긍정적',
// })

// export function intoMoviePaginationOutput(p: PaginationOutputWith<unknown>) {
//     return {
//         data: p.data.map((movie) =>
//             movieEntityIntoMovieOutput(movie as Movie & { genres: Genre[] }),
//         ),
//         meta: p.meta,
//     } as PaginationOutputWith<MovieOutput>;
// }
