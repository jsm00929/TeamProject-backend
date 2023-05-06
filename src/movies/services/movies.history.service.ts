import {prisma} from '../../config/db';
import MoviesHistoryRepository from '../repositories/movies.history.repository';
import {AppError} from '../../core/types';
import {ErrorMessages, HttpStatus} from '../../core/constants';
import {PaginationQuery} from '../../core/dtos/inputs';
import {PickIds, PickIdsWithTx} from '../../core/types/pick_ids';
import {PaginationOutput} from '../../core/dtos/outputs/pagination_output';
import {MovieHistoryOutput} from "../dtos/outputs/movie_history.output";

async function histories(
    {userId}: PickIds<'user'>,
    q: PaginationQuery,
): Promise<PaginationOutput<MovieHistoryOutput>> {
    return prisma.$transaction(async (tx) => {
        return MoviesHistoryRepository.findManyMovieHistoriesByUserId({userId, tx}, q);
    });
}

async function createOrUpdate(
    {
        userId,
        movieId,
        tx,
    }: PickIdsWithTx<'user' | 'movie'>) {
    const movieHistory = await MoviesHistoryRepository.findMovieHistoryByUserIdAndMovieId({
        userId,
        movieId,
        tx,
    });

    if (!movieHistory) {
        await MoviesHistoryRepository.createMovieHistory({userId, movieId, tx});
    } else {
        await MoviesHistoryRepository.updateMovieHistoryLastViewedAtById({
            movieHistoryId: movieHistory.id,
            tx,
        });
    }
}

async function removeMovieHistory({userId, movieId}: PickIds<'user' | 'movie'>) {
    return prisma.$transaction(async (tx) => {
        const movieHistory = await MoviesHistoryRepository.findMovieHistoryByUserIdAndMovieId({
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
        await MoviesHistoryRepository.removeMovieHistoryById({
            movieHistoryId: movieHistory.id,
            tx,
        });
    });
}

export default {
    histories,
    createOrUpdate,
    removeMovieHistory,
};
