// FETCH
import {PaginationQuery} from '../../core/dtos/inputs';
import {PaginationOutput} from '../../core/dtos/outputs/pagination_output';
import {PickIdsWithTx} from '../../core/types/pick_ids';
import {MovieHistoryOutput, MovieWithHistory,} from '../dtos/outputs/movie_history.output';

async function findMovieHistoryByUserIdAndMovieId(
    {
        userId,
        movieId,
        tx,
    }: PickIdsWithTx<'user' | 'movie'>) {
    return tx.movieHistory.findFirst({
        where: {
            movieId,
            userId,
        },
    });
}

async function findManyMovieHistoriesByUserId(
    {userId, tx}: PickIdsWithTx<'user'>,
    {count, after}: PaginationQuery,
): Promise<PaginationOutput<MovieHistoryOutput>> {
    const entities: MovieWithHistory[] = await tx.movieHistory.findMany({
        where: {
            userId,
        },
        skip: after ? 1 : 0,
        take: count + 1,
        ...(after !== undefined && {cursor: {id: after}}),
        include: {
            movie: true,
        },
    });

    const data = entities.map((e) => MovieHistoryOutput.from(e));
    return PaginationOutput.from(data, count);
}

async function createMovieHistory(
    {
        userId,
        movieId,
        tx,
    }: PickIdsWithTx<'user' | 'movie'>) {
    const movieHistory =
        await tx.movieHistory.create({
            data: {
                movieId,
                userId,
            },
        });
    return movieHistory.id;
}

async function removeMovieHistoryById(
    {
        movieHistoryId,
        tx,
    }: PickIdsWithTx<'movieHistory'>) {
    await tx.movieHistory.delete({
        where: {
            id: movieHistoryId,
        },
    });
}

async function updateMovieHistoryLastViewedAtById(
    {
        movieHistoryId,
        tx,
    }: PickIdsWithTx<'movieHistory'>) {
    await tx.movieHistory.update({
        where: {
            id: movieHistoryId,
        },
        data: {
            lastViewedAt: new Date(),
        },
    });
}

export default {
    findMovieHistoryByUserIdAndMovieId,
    findManyMovieHistoriesByUserId,
    createMovieHistory,
    removeMovieHistoryById,
    updateMovieHistoryLastViewedAtById,
};
