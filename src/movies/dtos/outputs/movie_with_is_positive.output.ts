import { MovieOutput } from "./movie.output";
import { MovieWithGenresOutput } from "./movie_with_genres.output";

export class MovieWithIsPositiveOutput {
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
  isPositive: boolean = false;
  genres: string[];

  protected constructor(m: MovieWithGenresOutput, isPositive?: boolean | null) {
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
    this.isFavorite = m.isFavorite;
    this.isLiked = m.isLiked;
    this.isPositive = isPositive ?? false;
    this.genres = m.genres;
  }

  static from(
    m: MovieWithGenresOutput,
    isPositive?: boolean | null
  ): MovieWithIsPositiveOutput {
    return new MovieWithIsPositiveOutput(m, isPositive);
  }

  // static from(
  //   m: Movie,
  //   {
  //     isFavorite,
  //     isLiked,
  //     isPositive,
  //   }: {
  //     isFavorite?: boolean | null;
  //     isLiked?: boolean | null;
  //     isPositive?: boolean | null;
  //   } = { isLiked: false, isFavorite: false, isPositive: false }
  // ): MovieWithIsPositiveOutput {
  //   return new MovieWithIsPositiveOutput(m, isFavorite, isLiked, isPositive);
  // }

  // static nullOrFrom(
  //   m: Movie | null,
  //   {
  //     isFavorite,
  //     isLiked,
  //     isPositive,
  //   }: {
  //     isFavorite?: boolean | null;
  //     isLiked?: boolean | null;
  //     isPositive?: boolean | null;
  //   } = { isLiked: false, isFavorite: false, isPositive: false }
  // ): MovieWithIsPositiveOutput | null {
  //   return isNullOrDeleted(m)
  //     ? null
  //     : this.from(m!, { isFavorite, isLiked, isPositive });
  // }
}
