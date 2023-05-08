import {prisma} from '../../config/db';
import MoviesHistoryRepository from '../repositories/movies.history.repository';
import {AppError} from '../../core/types';
import {ErrorMessages, HttpStatus} from '../../core/constants';
import {PaginationQuery, PaginationQueryWithCursor} from '../../core/dtos/inputs';
import {PickIds, PickIdsWithTx} from '../../core/types/pick_ids';
import {PaginationOutput} from '../../core/dtos/outputs/pagination_output';
import {MovieHistoryOutput} from "../dtos/outputs/movie_history.output";
import MoviesMetadataRepository from "../repositories/movies.metadata.repository";

async function histories(
    {userId}: PickIds<'user'>,
    {count, after}: PaginationQuery,
): Promise<PaginationOutput<MovieHistoryOutput>> {
    return prisma.$transaction(async (tx) => {

        const q: PaginationQueryWithCursor = {count, after};

        // after가 생략되었을 경우, latest cursor을 얻기 위해 metadata 가져옴
        if (after === undefined) {
            let metaData = await MoviesMetadataRepository.findByUserId({userId, tx});

            // metaData가 DB에 없는 사용자의 경우, 생성
            if (metaData === null) {
                metaData = await MoviesMetadataRepository.createAndReturn({userId, tx});
            }

            // DB에서 가져온 latestHistoryId 추가
            q.cursor = metaData.latestHistoryId !== null ? metaData.latestHistoryId : undefined;
        }

        return MoviesHistoryRepository.findManyByUserId({userId, tx}, q);
    });
}

async function createOrUpdate(
    {
        userId,
        movieId,
        tx,
    }: PickIdsWithTx<'user' | 'movie'>) {
    let movieHistory = await MoviesHistoryRepository.findByUserIdAndMovieId({
        userId,
        movieId,
        tx,
    });

    if (!movieHistory) {
        movieHistory = await MoviesHistoryRepository.create({userId, movieId, tx});
    } else {
        await MoviesHistoryRepository.updateLastViewedAtById({
            movieHistoryId: movieHistory.id,
            tx,
        });
    }
    return movieHistory;
}


// movieHistoryId -> 가져온 뒤, login user id와 비교
// (userId, movieId) -> 가져올 때부터 userId 필요하므로 비교 필요 없음 복합키므로 index 비용 2배
async function deleteByUserIdAndMovieId({userId, movieId}: PickIds<'user' | 'movie'>) {
    return prisma.$transaction(async (tx) => {
        const movieHistory = await MoviesHistoryRepository.findByUserIdAndMovieId({
            userId,
            movieId,
            tx,
        });

        if (!movieHistory) {
            throw AppError.new({
                message: ErrorMessages.NOT_FOUND,
                status: HttpStatus.NOT_FOUND,
            });
        }
        await MoviesHistoryRepository.softDeleteById({
            movieHistoryId: movieHistory.id,
            tx,
        });
    });
}

export default {
    histories,
    createOrUpdate,
    deleteByUserIdAndMovieId,
};
