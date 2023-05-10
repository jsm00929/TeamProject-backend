// FETCH
import {PaginationQueryWithCursor} from '../../core/dtos/inputs';
import {PaginationOutput} from '../../core/dtos/outputs/pagination_output';
import {PickIdsWithTx} from '../../core/types/pick_ids';
import {MovieHistoryOutput, MovieWithHistory,} from '../dtos/outputs/movie_history.output';
import {isDeleted} from "../../utils/is_null_or_deleted";
import {nullOrFirst} from "../../utils/null_or_first";

async function findByUserIdAndMovieId(
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

async function findNextById(
    {userId, movieHistoryId, tx}: PickIdsWithTx<'user' | 'movieHistory'>
) {
    const entities = await tx.movieHistory.findMany({
        where: {
            userId,
        },
        orderBy: {
            lastViewedAt: 'desc',
        },
        cursor: {
            id: movieHistoryId
        },
        skip: 1,
        take: 1,
    });

    console.log(entities)

    return nullOrFirst(entities);
}

async function findManyByUserId(
    {userId, tx}: PickIdsWithTx<'user'>,
    {count, after, cursor}: PaginationQueryWithCursor,
): Promise<PaginationOutput<MovieHistoryOutput>> {

    let entities: MovieWithHistory[] = [];

    // 1. after === undefined -> 1페이지 페이지네이션
    //  - 1. cursor === null -> history 없는 사용자 -> query 실행 x
    //  - 2. cursor !== null -> history 있는 사용자 -> query 실행 o
    //
    // 2. after === undefined -> 페이지네이션
    //  - 1. cursor === null -> history 없는 사용자 -> query 실행 o, 결과 x
    //  - 2. cursor !== null -> history 있는 사용자 -> query 실행 o
    if (after || cursor) {
        entities = await tx.movieHistory.findMany({
            where: {
                userId,
            },
            orderBy: {
                lastViewedAt: 'desc',
            },
            cursor: {
                // after | cursor 중 하나 존재
                // after가 있는 경우는 after 이후의 MovieHistory를 count만큼 가져옴
                // cursor가 있는 경우는 cursor부터 count만큼 가져옴
                id: after ? after : cursor,
            },
            skip: after ? 1 : 0,
            take: count + 1,
            include: {
                movie: true,
            },
        });
    }

    const data = entities
        .filter((m) => !isDeleted(m))
        .map((m) => MovieHistoryOutput.from(m));

    return PaginationOutput.from(data, count);
}

async function create(
    {
        userId,
        movieId,
        tx,
    }: PickIdsWithTx<'user' | 'movie'>) {
    return tx.movieHistory.create({
        data: {
            movieId,
            userId,
        },
    });
}

async function createOrRestoreAndReturn(
    {
        userId,
        movieId,
        tx,
    }: PickIdsWithTx<'user' | 'movie'>) {

    const history = await tx.movieHistory.create({
        data: {
            movieId,
            userId,
        },
    });

    // 2. 삭제된 경우 복구
    if (isDeleted(history)) {
        await restoreById({
            movieHistoryId: history.id,
            tx,
        });
    }

    return history;
}

async function softDeleteById(
    {
        movieHistoryId,
        tx,
    }: PickIdsWithTx<'movieHistory'>) {
    await tx.movieHistory.update({
        where: {
            id: movieHistoryId,
        },
        data: {
            deletedAt: new Date(),
        },
    });
}

async function restoreById(
    {
        movieHistoryId,
        tx,
    }: PickIdsWithTx<'movieHistory'>) {
    await tx.movieHistory.update({
        where: {
            id: movieHistoryId,
        },
        data: {
            deletedAt: null,
        },
    });
}

async function updateLastViewedAtById(
    {
        movieHistoryId,
        tx,
    }: PickIdsWithTx<'movieHistory'>) {
    return tx.movieHistory.update({
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
    findNextById,
    create,
    createOrRestoreAndReturn,
    softDeleteById,
    restoreById,
    updateLastViewedAtById,
};
