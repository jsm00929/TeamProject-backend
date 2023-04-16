import { FetchGenresDto } from './dtos/fetch_genres.dto';
import { tmdbClient } from './tmdb_client';

export async function fetchAllGenres() {
  const {
    data: { genres },
  } = await tmdbClient.get<FetchGenresDto>(`/genre/movie/list`);

  return genres;
}
