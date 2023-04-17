import usersService from './users.service';
import { UpdateUserAvatarUrlBody } from './dtos/inputs/update_user_avatar_url.body';
import { AuthRequest, AuthRequestWith, RequestWith } from '../core/types';
import { AppResult } from '../core/types/app_result';
import { UserIdParams } from './dtos/inputs/user_id.params';
import reviewsService from '../reviews/reviews.service';
import { PaginationQuery } from '../core/dtos/inputs';
import moviesService from '../movies/movies.service';

async function me(req: AuthRequest) {
  const userId = req.userId;
  const me = await usersService.mustGetMySimpleInfo(userId);

  return AppResult.new({ body: me });
}

async function myDetailInfo(req: AuthRequest) {
  const userId = req.userId;
  const myDetailInfo = await usersService.mustGetMyDetailInfo(userId);

  return AppResult.new({ body: myDetailInfo });
}

async function simpleInfo(req: RequestWith<never, UserIdParams>) {
  const { userId } = req.unwrapParams();
  const userSimpleInfo = await usersService.getSimpleInfo(userId);

  return AppResult.new({ body: userSimpleInfo });
}

async function update(req: AuthRequestWith<UpdateUserAvatarUrlBody>) {
  const userId = req.userId;
  const updateUserInput = req.unwrap();

  await usersService.updateMyInfo(userId, updateUserInput);
}

async function withdraw(req: AuthRequest) {
  const userId = req.userId;

  await usersService.withdraw(userId);
}

/**
 * REVIEWS
 */

async function getMyReviewOverviews(req: AuthRequestWith<PaginationQuery>) {
  const { userId } = req;
  const paginationQuery = req.unwrap();
  console.log(userId);
  console.log('okok');

  const myReviews = await reviewsService.getReviewOverviewsByUserId(
    userId,
    paginationQuery,
  );

  return AppResult.new({ body: myReviews });
}

async function getReviewOverviews(
  req: RequestWith<PaginationQuery, UserIdParams>,
) {
  const { userId } = req.unwrapParams();
  const paginationQuery = req.unwrap();

  const reviews = await reviewsService.getReviewOverviewsByUserId(
    userId,
    paginationQuery,
  );

  return AppResult.new({ body: reviews });
}

/**
 * MOVIES
 */

async function getMyRecentlyViewedMovies(
  req: AuthRequestWith<PaginationQuery>,
) {
  const { userId } = req;
  const paginationQuery = req.unwrap();

  const movies = await moviesService.getRecentlyViewed(userId, paginationQuery);

  return AppResult.new({ body: movies });
}

async function getMyFavoriteMovies(req: AuthRequestWith<PaginationQuery>) {
  const { userId } = req;
  const paginationQuery = req.unwrap();

  const movies = await moviesService.getFavorites(userId, paginationQuery);

  return AppResult.new({ body: movies });
}

/**
 * EXPORT
 */
export default {
  me,
  myDetailInfo,
  simpleInfo,
  update,
  withdraw,
  getMyReviewOverviews,
  getReviewOverviews,
  getMyFavoriteMovies,
  getMyRecentlyViewedMovies,
};
