import { prisma } from "../../config/db";
import moviesRepository from "../repositories/movies.repository";
import { MoviesPaginationQuery } from "../dtos/inputs/movies_pagination.query";
import { PaginationOutput } from "../../core/dtos/outputs/pagination_output";
import { MovieOutput } from "../dtos/outputs/movie.output";
import { PickIds } from "../../core/types/pick_ids";
import { MovieWithGenresOutput } from "../dtos/outputs/movie_with_genres.output";
import moviesHistoryService from "./movies.history.service";

/**
 * FETCH
 */
async function movies(
  q: MoviesPaginationQuery
): Promise<PaginationOutput<MovieWithGenresOutput>> {
  return prisma.$transaction(async (tx) => {
    return moviesRepository.findManyMovies({ tx }, q);
  });
}

//
// 1. 조회
// 2. add or restore history
//   -> add     -> update metadata(last id, count)
//   -> restore -> update metadata(last id, count)
async function movieDetail({
  userId,
  movieId,
}: Partial<PickIds<"user">> & PickIds<"movie">): Promise<MovieOutput | null> {
  return prisma.$transaction(async (tx) => {
    // 로그인 된 사용자가 movie detail 조회 시,
    if (userId) {
      await moviesHistoryService.updateLatestViewedAtWithMetaData({
        userId,
        movieId,
        tx,
      });
    }
    return moviesRepository.findDetailById({ movieId, tx });
  });
}

// 루트페이지, 카테고리별페이지
// 루트 - sort, 검색 기능

// // 최근 본 영화 삭제
// async function deleteById(
//     {
//         userId,
//         movieId,
//         tx,
//     }: PickIdsWithTx<'user' | 'movie'>,
// ) {
//     return prisma.$transaction(async (tx) => {
//         const userMovie = await moviesRepository.findUserMovie({movieId, tx, userId});
//         if (userMovie === null) {
//             throw AppError.new({
//                 message: ErrorMessages.NOT_FOUND,
//                 status: HttpStatus.NOT_FOUND,
//             });
//         }
//         await moviesRepository.deleteUserMovie({userMovieId: userMovie.id, tx});
//     });
// }

export default {
  movies,
  movieDetail,
};
