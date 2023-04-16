import moviesService from './movies.service';
import { HandlerResponse } from '../core/middlewares/handle_response';
import { AuthRequestWith, RequestWith } from '../core/types/request_with';
import { PaginationQuery } from '../core/dtos/inputs/pagination.query';
import { MovieIdParams } from './dtos/inputs/get_movie_detail.params';

async function getPopularMovies(
  req: RequestWith<PaginationQuery>,
): Promise<HandlerResponse> {
  const paginationInput = req.unwrap();
  const movies = await moviesService.getPopularMovies(paginationInput);

  return { body: movies };
}

async function getMovieDetail(
  req: AuthRequestWith<never, MovieIdParams>,
): Promise<HandlerResponse> {
  const userId = req.userId;
  const { movieId } = req.unwrapParams();
  const movieDetail = await moviesService.getMovieDetail(userId, movieId);

  return { body: movieDetail };
}

export default {
  getPopularMovies,
  getMovieDetail,
};
