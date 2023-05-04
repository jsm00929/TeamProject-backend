// FETCH
import {MovieHistoryId, MovieRecord, prismaClient, TxRecord, UserRecord} from "../../core/types/tx";
import {PaginationQuery} from "../../core/dtos/inputs";
import {PaginationOutputWith} from "../../core/dtos/outputs/pagination_output";
import {MovieHistory} from "@prisma/client";

async function findByUserIdAndMovieId(
    {userId, movieId, tx}: Pick<UserRecord, 'userId'> & Pick<MovieRecord, 'movieId'> & TxRecord,
) {
    return prismaClient(tx).movieHistory.findFirst({
        where: {
            movieId,
            userId,
        }
    });
}

async function findManyByUserId(
    {userId, tx}: Pick<UserRecord, 'userId'> & TxRecord,
    {count, after}: PaginationQuery,
): Promise<PaginationOutputWith<MovieHistory>> {

    const data = await prismaClient(tx).movieHistory.findMany({
        where: {
            userId,
        },
        skip: 1,
        take: count + 1,
        ...(after !== undefined && {cursor: {id: after}}),
    });

    return PaginationOutputWith.from({data, count});
}

async function create(
    {userId, movieId, tx}: Pick<UserRecord, 'userId'> & Pick<MovieRecord, 'movieId'> & TxRecord,
) {
    return prismaClient(tx).movieHistory.create({
        data: {
            movieId,
            userId,
        }
    });
}

async function removeById(
    {movieHistoryId, tx}: Pick<MovieHistoryId, 'movieHistoryId'> & TxRecord,
) {
    return prismaClient(tx).movieHistory.delete({
        where: {
            id: movieHistoryId,
        }
    });
}

async function updateById(
    {movieHistoryId, tx}: Pick<MovieHistoryId, 'movieHistoryId'> & TxRecord,
) {
    return prismaClient(tx).movieHistory.update({
        where: {
            id: movieHistoryId,
        },
        data: {
            lastViewedAt: new Date(),
        },
    });
}

export default {
    findByUserIdAndMovieId,
    findManyByUserId,
    create,
    removeById,
    updateById,
}