import { Genre, Movie } from '@prisma/client';

export interface MovieOutput {
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
}

export function movieEntityIntoMovieOutput({
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
  genres,
}: Movie & { genres: Genre[] }): MovieOutput {
  return {
    id,
    title,
    overview,
    popularity,
    backdropUrl,
    posterUrl,
    lang,
    genres: genres.map((g) => g.name),
    releaseDate,
    voteAverage,
    voteCount,
  };
}
