import { Genre } from '@prisma/client';

export interface MovieWithGenre {
  id: number;
  title: string;
  titleKo: string | null;
  overview: string;
  overviewKo: string | null;
  adult: boolean;
  popularity: number;
  voteCount: number;
  voteAverage: number;
  backdropUrl: string | null;
  posterUrl: string | null;
  lang: string;
  releaseDate: Date | null;
  genres: Genre[];
}
