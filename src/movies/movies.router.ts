import { Router } from 'express';
import { mustValidQuery } from '../core/middlewares/must_valid';
import { handle, handleResponse } from '../core/middlewares/handle_response';
import moviesController from './movies.controller';
import { PaginationQuery } from '../core/dtos/inputs/pagination.query';
import { MovieIdParams } from './dtos/inputs/get_movie_detail.params';

const moviesRouter = Router();

moviesRouter.get(
  '/popular',
  handle({
    queryCls: PaginationQuery,
    controller: moviesController.getPopularMovies,
  }),
);

moviesRouter.get(
  '/detail/:movieId',
  handle({
    paramsCls: MovieIdParams,
    controller: moviesController.getMovieDetail,
  }),
);

export default moviesRouter;
