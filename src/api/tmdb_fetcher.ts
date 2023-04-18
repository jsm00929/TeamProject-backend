import { prisma } from '../config/db';
import { FetchGenresDto } from './dtos/fetch_genres.dto';
import { FetchReviewsByMovieIdDto } from './dtos/fetch_reviews_by_movie_id.dto';
import { tmdbClient } from './tmdb_client';

export async function fetchAllGenres() {
  const {
    data: { genres },
  } = await tmdbClient.get<FetchGenresDto>(`/genre/movie/list`);

  return genres;
}

export async function fetchReviewsByMovieId(movieId: number) {
  const {
    data: { results },
  } = await tmdbClient.get<FetchReviewsByMovieIdDto>(
    `/movie/${movieId}/reviews`,
  );

  return results;
}
