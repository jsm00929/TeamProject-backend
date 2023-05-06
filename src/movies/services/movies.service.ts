import {prisma} from '../../config/db';
import moviesRepository from '../repositories/movies.repository';
import {MoviesPaginationQuery,} from '../dtos/inputs/movies_pagination.query';
import moviesHistoryService from './movies.history.service';
import {PaginationOutput} from "../../core/dtos/outputs/pagination_output";
import {MovieOutput} from "../dtos/outputs/movie.output";
import {PickIds} from "../../core/types/pick_ids";

/**
 * FETCH
 */
async function movies(q: MoviesPaginationQuery): Promise<PaginationOutput<MovieOutput>> {
    return prisma.$transaction(async (tx) => {
        return moviesRepository.findManyMovies({tx}, q);
    });

}


async function movieDetail({userId, movieId}: Partial<PickIds<'user'>> & PickIds<'movie'>,
): Promise<MovieOutput | null> {

    return prisma.$transaction(async (tx) => {
        console.log('userId', userId);
        if (userId) {
            await moviesHistoryService.createOrUpdate({userId, movieId, tx});
        }

        return moviesRepository.findMovieDetailById({movieId, tx});
    });
}

// 루트페이지, 카테고리별페이지
// 루트 - sort, 검색 기능

// 최근 본 영화 삭제
// async function deleteRecentlyViewedMovie(
//     {
//         userId,
//         movieId,
//     }: Pick<UserRecord, 'userId'> & Pick<MovieRecord, 'movieId'>,
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
