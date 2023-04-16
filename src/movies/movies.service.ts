import { PaginationQuery } from '../core/dtos/inputs/pagination.query';
import moviesRepository from './movies.repository';

async function getPopularMovies(paginationInput: PaginationQuery) {
  return moviesRepository.getPopularMovies(paginationInput);
}

async function getMovieDetail(userId: number | undefined, movieId: number) {
  if (userId) {
    await moviesRepository.updateViewedAt(userId, movieId);
  }

  return moviesRepository.getMovieDetail(movieId);
}

async function toggleFavoriteMovie(userId: number, movieId: number) {
  await moviesRepository.toggleFavoriteMovie(userId, movieId);
}

export default {
  getPopularMovies,
  getMovieDetail,
  toggleFavoriteMovie,
};
