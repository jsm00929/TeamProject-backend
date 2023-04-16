import moviesRepository from '../movies/movies.repository';
import { GenreDto } from './dtos/fetch_genres.dto';

export async function createGenresIfNotExists(genres: GenreDto[]) {
  genres.forEach(async (genre) => {
    await moviesRepository.upsertGenre(genre);
  });
}
