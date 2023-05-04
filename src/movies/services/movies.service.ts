import {prisma} from '../../config/db';
import {MovieRecord, UserRecord} from '../../core/types/tx';
import usersRepository from '../../users/users.repository';
import moviesRepository from '../repositories/movies.repository';
import {MoviesPaginationQuery,} from '../movies_pagination.query';
import moviesHistoryService from './movies.history.service';
import {PaginationOutputWith} from "../../core/dtos/outputs/pagination_output";
import {MovieOutput} from "../dtos/outputs/movie.output";

/**
 * FETCH
 */
async function movies(q: MoviesPaginationQuery): Promise<PaginationOutputWith<MovieOutput>> {
    return moviesRepository.findManyMovies({}, q);

}


async function movieDetail(
    {
        userId,
        movieId,
    }: Partial<Pick<UserRecord, 'userId'>> & Pick<MovieRecord, 'movieId'>
): Promise<MovieOutput | null> {

    return prisma.$transaction(async (tx) => {
        if (userId) {
            const user = await usersRepository.findUserById({userId, tx});
            if (user !== null) {
                await moviesHistoryService.createOrUpdate({userId, movieId, tx});
            }
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
