import {PaginationQuery} from '../../core/dtos/inputs';
import {PaginationOutput} from '../../core/dtos/outputs/pagination_output';
import {PickIdsWithTx} from '../../core/types/pick_ids';

async function findByUserIdAndMovieId(
    {
        userId,
        movieId,
        tx,
    }: PickIdsWithTx<'user' | 'movie'>
) {
    return tx.favoriteMovie.findFirst({
        where: {
            movieId,
            userId,
        },
    });
}

async function findManyByUserId(
    {userId, tx}: PickIdsWithTx<'user'>,
    {count, after}: PaginationQuery,
) {
    const entities = await tx.favoriteMovie.findMany({
        where: {
            userId,
        },
        ...(after !== undefined && {cursor: {id: after}}),
        skip: after ? 1 : 0,
        take: count + 1,
    });

    return PaginationOutput.from({data: entities, count: entities.length});
}

async function create(
    {
        userId,
        movieId,
        tx,
    }: PickIdsWithTx<'user' | 'movie'>,
) {
    return tx.favoriteMovie.create({
        data: {
            movieId,
            userId,
        },
    });
}

async function removeById(
    {
        favoriteMovieId,
        tx,
    }: PickIdsWithTx<'favoriteMovie'>) {
    return tx.favoriteMovie.delete({
        where: {
            id: favoriteMovieId,
        },
    });
}

export default {
    findByUserIdAndMovieId,
    create,

    removeById,
};
