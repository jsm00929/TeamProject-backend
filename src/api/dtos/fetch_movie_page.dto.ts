export interface FetchMoviePageDto {
  page: number;
  results: FetchMovieDto[];
}

export interface FetchMovieDto {
  adult: false;
  backdropPath: string;
  genreIds: number[];
  id: number;
  originalLanguage: string;
  originalTitle: string;
  overview: string;
  popularity: number;
  posterPath: string;
  releaseDate: Date;
  title: string;
  video: boolean;
  voteAverage: number;
  voteCount: number;
}
