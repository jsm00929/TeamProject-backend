import moviesService from './movies.service';
import { AuthRequestWith, RequestWith } from '../core/types';
import { PaginationQuery } from '../core/dtos/inputs';
import { MovieIdParams } from './dtos/inputs/get_movie_detail.params';
import { AppResult } from '../core/types/app_result';
import reviewsService from '../reviews/reviews.service';
import { EditMovieReviewBody } from '../reviews/dtos/inputs/edit_review.body';
import { ReviewIdParams } from '../reviews/dtos/inputs/review_id.params';
import { CreateMovieReviewBody } from '../reviews/dtos/inputs/create_movie_review.body';
import { HttpStatus } from '../core/constants';
import commentsService from '../comments/comments.service';
import { MoviesPaginationQuery } from './dtos/inputs/movies_pagination.query';

async function movies(req: RequestWith<MoviesPaginationQuery>) {
  const q = req.unwrap();
  const movies = await moviesService.getMovies(q);

  return AppResult.new({ body: movies });
}

async function getPopularMovies(req: RequestWith<PaginationQuery>) {
  const paginationInput = req.unwrap();
  const movies = await moviesService.getPopularMovies(paginationInput);

  return AppResult.new({ body: movies });
}

async function getMovieDetail(req: AuthRequestWith<never, MovieIdParams>) {
  const userId = req.userId;
  const { movieId } = req.unwrapParams();
  const movieDetail = await moviesService.getMovieDetail(userId, movieId);

  return AppResult.new({ body: movieDetail });
}

/**
 * Movie Reviews
 */

async function writeReview(
  req: AuthRequestWith<CreateMovieReviewBody, MovieIdParams>,
) {
  const { userId } = req;
  const { movieId } = req.unwrapParams();
  const createReviewInput = req.unwrap();

  const reviewId = await reviewsService.write(
    userId,
    movieId,
    createReviewInput,
  );

  return AppResult.new({
    body: { reviewId },
    status: HttpStatus.CREATED,
  });
}

async function editReview(
  req: AuthRequestWith<EditMovieReviewBody, ReviewIdParams>,
) {
  const userId = req.userId;
  const editReviewInput = req.unwrap();
  const { reviewId } = req.unwrapParams();

  await reviewsService.edit(userId, reviewId, editReviewInput);
}

async function removeReview(req: AuthRequestWith<never, ReviewIdParams>) {
  const userId = req.userId;
  const { reviewId } = req.unwrapParams();

  await reviewsService.remove(userId, reviewId);
}

/**
 * MOVIE REVIEW COMMENTS
 */

async function getMovieReviewComments(
  req: RequestWith<PaginationQuery, ReviewIdParams>,
) {
  const query = req.unwrap();
  const { reviewId } = req.unwrapParams();
  const myComments = await commentsService.getReviewComments(reviewId, query);

  return AppResult.new({
    body: myComments,
  });
}

export default {
  movies,
  getPopularMovies,
  getMovieDetail,
  getMovieReviewComments,
  writeReview,
  editReview,
  removeReview,
};
