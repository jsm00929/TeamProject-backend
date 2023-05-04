import {FavoriteMovieRecord, MovieRecord, prismaClient, TxRecord, UserRecord} from "../../core/types/tx";
import {PaginationQuery} from "../../core/dtos/inputs";
import {PaginationOutputWith} from "../../core/dtos/outputs/pagination_output";

async function findByUserIdAndMovieId(
    {userId, movieId, tx}: Pick<UserRecord, 'userId'> & Pick<MovieRecord, 'movieId'> & TxRecord,
) {
    return prismaClient(tx).favoriteMovie.findFirst({
        where: {
            movieId,
            userId,
        }
    });
}

async function findManyByUserId(
    {userId, tx}: Pick<UserRecord, 'userId'> & TxRecord,
    {count, after}: PaginationQuery
) {
    const data = await prismaClient(tx).favoriteMovie.findMany({
        where: {
            userId,
        },
        ...(after !== undefined && {cursor: {id: after}}),
        skip: 1,
        take: count + 1,
    });

    return PaginationOutputWith.from({data, count});
}

async function create(
    {userId, movieId, tx}: Pick<UserRecord, 'userId'> & Pick<MovieRecord, 'movieId'> & TxRecord,
) {
    return prismaClient(tx).favoriteMovie.create({
        data: {
            movieId,
            userId,
        }
    });
}


async function removeById(
    {favoriteMovieId, tx}: Pick<FavoriteMovieRecord, 'favoriteMovieId'> & TxRecord,
) {
    return prismaClient(tx).favoriteMovie.delete({
        where: {
            id: favoriteMovieId,
        }
    });
}

export default {
    findByUserIdAndMovieId,
    create,
    removeById,
}