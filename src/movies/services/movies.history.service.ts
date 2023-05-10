import {prisma} from '../../config/db';
import MoviesHistoryRepository from '../repositories/movies.history.repository';
import moviesHistoryRepository from '../repositories/movies.history.repository';
import {PaginationQuery, PaginationQueryWithCursor} from '../../core/dtos/inputs';
import {PickIds, PickIdsWithTx} from '../../core/types/pick_ids';
import {PaginationOutput} from '../../core/dtos/outputs/pagination_output';
import {MovieHistoryOutput} from "../dtos/outputs/movie_history.output";
import MoviesMetadataService from "./movies.metadata.service";
import moviesMetadataService from "./movies.metadata.service";
import MoviesMetadataRepository from "../repositories/movies.metadata.repository";
import {isNullOrDeleted} from "../../utils/is_null_or_deleted";
import {isDeletableOrThrow} from "../../core/validators/is_deletable";

async function histories(
    {userId}: PickIds<'user'>,
    {count, after}: PaginationQuery,
): Promise<PaginationOutput<MovieHistoryOutput>> {
    return prisma.$transaction(async (tx) => {

        const q: PaginationQueryWithCursor = {count, after};

        // after가 생략되었을 경우, latest cursor을 얻기 위해 metadata 가져옴
        if (after === undefined) {
            const {latestHistoryId} = await MoviesMetadataRepository.findByUserIdOrCreateAndReturn({userId, tx});

            // DB에서 가져온 latestHistoryId 추가
            q.cursor = latestHistoryId !== null ? latestHistoryId : undefined;
        }

        return MoviesHistoryRepository.findManyByUserId({userId, tx}, q);
    });
}


async function updateLatestViewedAtWithMetaData(
    {
        userId,
        movieId,
        tx,
    }: PickIdsWithTx<'user' | 'movie'>,
) {
    let nextHistoriesCount: null | 'increment' = null;

    // 1. history 찾기 or 생성 or 복구
    let history = await moviesHistoryRepository.findByUserIdAndMovieId({
        movieId,
        userId,
        tx,
    });

    // 2. 존재하지 않는 경우, 생성 or 복구 및 metadata increment
    if (isNullOrDeleted(history)) {

        if (history === null) {
            history = await moviesHistoryRepository.create({
                userId,
                movieId,
                tx,
            });
        } else {
            await moviesHistoryRepository.restoreById({
                movieHistoryId: history.id,
                tx,
            });
        }

        nextHistoriesCount = 'increment';
    } else {
        await moviesHistoryRepository.updateLastViewedAtById({
            movieHistoryId: history!.id,
            tx,
        });
    }

    await moviesMetadataService.createOrUpdateLatestHistory({
        nextId: history!.id,
        historiesCount: nextHistoriesCount,
        userId,
        tx,
    });
}

async function deleteByUserIdAndMovieId({userId, movieId}: PickIds<'user' | 'movie'>) {
    return prisma.$transaction(async (tx) => {

        // 1. 삭제할 movie history 가져옴
        const history =
            await MoviesHistoryRepository.findByUserIdAndMovieId(
                {
                    userId,
                    movieId,
                    tx,
                });

        // 2. 삭제 가능 여부 확인 or throw not found error
        isDeletableOrThrow(history);

        await MoviesMetadataService.updateLatestHistoryIfLatest({
            movieHistoryId: history!.id,
            userId,
            tx,
        });

        // 4. soft delete
        await MoviesHistoryRepository.softDeleteById({
            movieHistoryId: history!.id,
            tx,
        });

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
    updateLatestViewedAtWithMetaData,
    deleteByUserIdAndMovieId,
};
