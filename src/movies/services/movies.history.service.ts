import {prisma} from '../../config/db';
import MoviesHistoryRepository from '../repositories/movies.history.repository';
import {AppError} from '../../core/types';
import {ErrorMessages, HttpStatus} from '../../core/constants';
import {PaginationQuery, PaginationQueryWithCursor} from '../../core/dtos/inputs';
import {PickIds, PickIdsWithTx} from '../../core/types/pick_ids';
import {PaginationOutput} from '../../core/dtos/outputs/pagination_output';
import {MovieHistoryOutput} from "../dtos/outputs/movie_history.output";
import MoviesMetadataService from "./movies.metadata.service";
import MoviesMetadataRepository from "../repositories/movies.metadata.repository";

async function histories(
    {userId}: PickIds<'user'>,
    {count, after}: PaginationQuery,
): Promise<PaginationOutput<MovieHistoryOutput>> {
    return prisma.$transaction(async (tx) => {

        const q: PaginationQueryWithCursor = {count, after};

        // after가 생략되었을 경우, latest cursor을 얻기 위해 metadata 가져옴
        if (after === undefined) {
            const {latestHistoryId} = await MoviesMetadataService.findByUserIdOrCreateAndReturn({userId, tx});

            // DB에서 가져온 latestHistoryId 추가
            q.cursor = latestHistoryId !== null ? latestHistoryId : undefined;
        }

        return MoviesHistoryRepository.findManyByUserId({userId, tx}, q);
    });
}

async function createOrRestoreAndUpdate(
    {
        userId,
        movieId,
        tx,
    }: PickIdsWithTx<'user' | 'movie'>
) {
    let movieHistory = await MoviesHistoryRepository.findByUserIdAndMovieId({
        userId,
        movieId,
        tx,
    });

    // 1. 없으면 만들고 return
    if (!movieHistory) {
        return MoviesHistoryRepository.create({userId, movieId, tx});
    }

    // 2. 삭제 되었으면 되돌리고
    if (movieHistory.deletedAt !== null) {
        await MoviesHistoryRepository.restoreById({
            movieHistoryId: movieHistory.id,
            tx,
        });
    }
    // 3. lastViewedAt 갱신
    await MoviesHistoryRepository.updateLastViewedAtById({
        movieHistoryId: movieHistory.id,
        tx,
    });
    return movieHistory;
}


// movieHistoryId -> 가져온 뒤, login user id와 비교
// (userId, movieId) -> 가져올 때부터 userId 필요하므로 비교 필요 없음 복합키므로 index 비용 2배
async function deleteByUserIdAndMovieId({userId, movieId}: PickIds<'user' | 'movie'>) {
    return prisma.$transaction(async (tx) => {

        // 1. 삭제할 movie history 가져옴
        const movieHistory = await MoviesHistoryRepository.findByUserIdAndMovieId({
            userId,
            movieId,
            tx,
        });

        // 2. 없으면 오류
        if (!movieHistory) {
            throw AppError.new({
                message: ErrorMessages.NOT_FOUND,
                status: HttpStatus.NOT_FOUND,
            });
        }

        // 3. 만약 latest history 라면 update,
        await MoviesMetadataService.updateLatestHistoryIfIsLatest({
            nextId: movieHistory.id,
            userId,
            tx,
        });

        // 4. soft delete
        await MoviesHistoryRepository.softDeleteById({
            movieHistoryId: movieHistory.id,
            tx,
        });
        // 5. decrement histories count
        await MoviesMetadataRepository.decrementMovieHistoriesCount({userId, tx});
    });
}


// async function softDeleteLatestMovieHistory(
//     {userId, movieHistoryId, tx}: PickIdsWithTx<'user' | 'movieHistory'>,
// ) {
//     // 1. 만약 latest movie history라면 history.latestMovieHistoryId update
//     await updateLatestHistoryIfIsLatest({
//         nextId: movieHistoryId,
//         tx,
//         userId,
//     });
//
// }


export default {
    histories,
    createOrRestoreAndUpdate,
    deleteByUserIdAndMovieId,
};
