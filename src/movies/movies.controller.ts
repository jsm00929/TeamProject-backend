import moviesService from './movies.service';
import { AuthRequestWith, RequestWith } from '../core/types/request_with';
import { PaginationQuery } from '../core/dtos/inputs/pagination.query';
import { MovieIdParams } from './dtos/inputs/get_movie_detail.params';
import { AppResult } from '../core/types/app_result';
import reviewsService from '../reviews/reviews.service';
import { EditMovieReviewBody } from '../reviews/dtos/edit_review.body';
import { ReviewIdParams } from '../reviews/dtos/review_id.params';
import { CreateMovieReviewBody } from '../reviews/dtos/create_movie_review.body';
import { HttpStatus } from '../core/constants';

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

async function writeReview(req: AuthRequestWith<CreateMovieReviewBody>) {
  const userId = req.userId;
  const createReviewInput = req.unwrap();

  const reviewId = await reviewsService.write(userId, createReviewInput);

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

export default {
  getPopularMovies,
  getMovieDetail,
  writeReview,
  editReview,
  removeReview,
};
