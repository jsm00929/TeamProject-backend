export interface CreateMovieInput {
  id: number;
  title: string;
  titleKo?: string;
  overview: string;
  overviewKo?: string;
  adult: boolean;
  popularity: number;
  voteCount: number;
  voteAverage: number;
  // budget: number; // 소요 예산,
  // revenue: number;
  // runtime: number;
  // status: string;
  backdropUrl: string;
  posterUrl: string;
  lang: string; // 사용 언어,
  releaseDate: Date;
  genreIds: number[];
  // country: string; // 제작 국가,
}
