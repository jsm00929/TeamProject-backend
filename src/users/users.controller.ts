import usersService from './users.service';
import { AuthRequest, AuthRequestWith, RequestWith } from '../core/types';
import { AppResult } from '../core/types/app_result';
import { UserIdParams } from './dtos/inputs/user_id.params';
import reviewsService from '../reviews/reviews.service';
import { PaginationQuery } from '../core/dtos/inputs';
import moviesService from '../movies/movies.service';
import { UpdateUserPasswordBody } from './dtos/inputs/update_user_password.body';
import { UpdateUserInfoBody } from './dtos/inputs/update_user_info.body';
import { DeleteUserBody } from './dtos/inputs/delete_user.body';
import { HttpStatus } from '../core/constants';
import { UpdateAvatarOutput } from './dtos/outputs/update_avatar.output';
import { filenameIntoStaticUrl } from '../utils/static_path_resolvers';

async function me(req: AuthRequest) {
  const userId = req.userId;
  const me = await usersService.getMySimpleInfo(userId);

  return AppResult.new({ body: me });
}

async function myDetailInfo(req: AuthRequest) {
  const userId = req.userId;
  const myDetailInfo = await usersService.getMyDetailInfo(userId);

  return AppResult.new({ body: myDetailInfo });
}

async function simpleInfo(req: RequestWith<never, UserIdParams>) {
  const { userId } = req.unwrapParams();
  const userSimpleInfo = await usersService.getSimpleInfo(userId);

  return AppResult.new({ body: userSimpleInfo });
}

async function updateMyInfo(req: AuthRequestWith<UpdateUserInfoBody>) {
  const userId = req.userId;
  const body = req.unwrap();

  await usersService.updateMyInfo(userId, body);
}

async function updateMyPassword(req: AuthRequestWith<UpdateUserPasswordBody>) {
  const userId = req.userId;
  const body = req.unwrap();

  await usersService.updatePassword(userId, body);
}

async function updateMyAvatar(
  req: AuthRequest & { file: Express.Multer.File },
) {
  const {
    userId,
    file: { filename },
  } = req;

  const avatarUrl = await usersService.updateAvatar(userId, filename);

  return AppResult.new({
    body: { avatarUrl } as UpdateAvatarOutput,
    status: HttpStatus.CREATED,
  });
}

async function withdraw(req: AuthRequestWith<DeleteUserBody>) {
  const userId = req.userId;
  const body = req.unwrap();
  await usersService.withdraw(userId, body);
}

/**
 * REVIEWS
 */

async function getMyReviewOverviews(req: AuthRequestWith<PaginationQuery>) {
  const { userId } = req;
  const query = req.unwrap();

  const myReviews = await reviewsService.getReviewOverviewsByUserId(
    userId,
    query,
  );

  return AppResult.new({ body: myReviews });
}

async function getReviewOverviews(
  req: RequestWith<PaginationQuery, UserIdParams>,
) {
  const { userId } = req.unwrapParams();
  const query = req.unwrap();

  const reviews = await reviewsService.getReviewOverviewsByUserId(
    userId,
    query,
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
  const query = req.unwrap();

  const movies = await moviesService.getRecentlyViewed(userId, query);

  return AppResult.new({ body: movies });
}

async function getMyFavoriteMovies(req: AuthRequestWith<PaginationQuery>) {
  const { userId } = req;
  const query = req.unwrap();

  const movies = await moviesService.getFavorites(userId, query);

  return AppResult.new({ body: movies });
}

/**
 * EXPORT
 */
export default {
  me,
  myDetailInfo,
  simpleInfo,
  updateMyInfo,
  updateMyPassword,
  updateMyAvatar,
  withdraw,
  getMyReviewOverviews,
  getReviewOverviews,
  getMyFavoriteMovies,
  getMyRecentlyViewedMovies,
};
