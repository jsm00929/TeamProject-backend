import usersService from './users.service';
import {AppError, AuthRequest, AuthRequestWith, OptionalAuthRequest, RequestWith,} from '../core/types';
import {AppResult} from '../core/types/app_result';
import {UserIdParams} from './dtos/inputs/user_id.params';
import reviewsService from '../reviews/reviews.service';
import {PaginationQuery} from '../core/dtos/inputs';
import moviesService from '../movies/movies.service';
import {UpdateMyPasswordBody} from './dtos/inputs/update_my_password.body';
import {UpdateMyNameBody} from './dtos/inputs/update_my_name.body';
import {ErrorMessages, HttpStatus} from '../core/constants';
import {UpdateAvatarOutput} from './dtos/outputs/update_avatar.output';
import {clearAuthCookies} from '../utils/cookie_store';
import {Response} from 'express';
import {DeleteUserBody} from './dtos/inputs/delete_user.body';

async function me(req: OptionalAuthRequest, res: Response) {
  const userId = req.userId;
  // 로그인 되어 있지 않은 경우
  if (userId === undefined) {
    return AppResult.new({ body: null, status: HttpStatus.UNAUTHORIZED });
  }

  const me = await usersService.userById(userId);

  if (me === null) {
    // 이미 탈퇴한 회원인 경우 쿠키를 지우고 에러를 던진다.
    clearAuthCookies(res);
    AppError.new({
      message: ErrorMessages.USER_NOT_FOUND,
      status: HttpStatus.NOT_FOUND,
    });
  }

  return AppResult.new({ body: me });
}

async function user(req: RequestWith<never, UserIdParams>, res: Response) {
  const { userId } = req.unwrapParams();
  const user = await usersService.userById(userId);

  return AppResult.new({ body: user });
}

async function updateMyPassword(
  req: AuthRequestWith<UpdateMyPasswordBody>,
  res: Response,
) {
  const userId = req.userId;
  const body = req.unwrap();

  try {
    await usersService.updatePassword(userId, body);
  } catch (error) {
    if (
      error instanceof AppError &&
      error.message === ErrorMessages.USER_NOT_FOUND
    ) {
      clearAuthCookies(res);
    }
    throw error;
  }
}

async function updateMyName(
  req: AuthRequestWith<UpdateMyNameBody>,
  res: Response,
) {
  const userId = req.userId;
  const body = req.unwrap();

  try {
    await usersService.updateName(userId, body);
  } catch (error) {
    if (
      error instanceof AppError &&
      error.message === ErrorMessages.USER_NOT_FOUND
    ) {
      clearAuthCookies(res);
    }
    throw error;
  }
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
  const { password } = req.unwrap();
  await usersService.withdraw(userId, password);
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
  user,
  updateMyName,
  updateMyPassword,
  updateMyAvatar,
  withdraw,
  getMyReviewOverviews,
  getReviewOverviews,
  getMyFavoriteMovies,
  getMyRecentlyViewedMovies,
};
