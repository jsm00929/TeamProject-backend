import {PickIdsWithTx} from "../../core/types/pick_ids";
import {MovieMetaData} from "@prisma/client";

async function findByUserId({userId, tx}: PickIdsWithTx<'user'>) {
    return tx.movieMetaData.findUnique({
        where: {
            userId,
        },
    });
}

async function findByUserIdOrCreateAndReturn(
    {userId, tx}: PickIdsWithTx<'user'>,
): Promise<MovieMetaData> {
    let metaData = await findByUserId({userId, tx});

    // metaData가 DB에 없는 사용자의 경우, 생성
    if (metaData === null) {
        metaData = await createAndReturn({userId, tx});
    }

    return metaData;
}

async function createIfExists({userId, tx}: PickIdsWithTx<'user'>) {
    const metaData = await findByUserId({userId, tx});

    if (metaData === null) {
        await createAndReturn({userId, tx});
    }
}

async function createAndReturn({userId, tx}: PickIdsWithTx<'user'>) {
    return tx.movieMetaData.create({
        data: {
            userId,
        },
    });
}


async function updateLatestHistory(
    {
        userId,
        nextId,
        historiesCount,
        tx,
    }: PickIdsWithTx<'user'>
        & {
        nextId: number | null,
        historiesCount: 'increment' | 'decrement' | null,
    },
) {
    await tx.movieMetaData.update({
        where: {
            userId,
        },
        data: {
            latestHistoryId: nextId,
            // undefined or { increment: true } or { decrement: true }
            ...(historiesCount !== null && {historiesCount: {[historiesCount]: 1}}),
        },
    });
}

async function updateLatestFavoriteMovieId({userId, favoriteMovieId, tx}: PickIdsWithTx<'user' | 'favoriteMovie'>) {
    await tx.movieMetaData.update({
        where: {
            userId,
        },
        data: {
            latestFavoriteId: favoriteMovieId,
        },
    });
}

async function updateLatestMovieLikeId({userId, movieLikeId, tx}: PickIdsWithTx<'user' | 'movieLike'>) {
    await tx.movieMetaData.update({
        where: {
            userId,
        },
        data: {
            latestLikeId: movieLikeId,
        },
    });
}


async function decrementFavoriteMoviesCount({userId, tx}: PickIdsWithTx<'user'>) {
    await tx.movieMetaData.update({
        where: {
            userId,
        },
        data: {
            favoritesCount: {
                decrement: 1,
            },
        },
    });
}

async function softDeleteByUserId({userId, tx}: PickIdsWithTx<'user'>) {
    await tx.movieMetaData.update({
        where: {
            userId,
        },
        data: {
            deletedAt: new Date(),
        },
    });
}

export default {
    findByUserIdOrCreateAndReturn,
    findByUserId,
    createAndReturn,
    createIfExists,
    softDeleteByUserId,
    updateLatestHistory,
    updateLatestMovieLikeId,
    updateLatestFavoriteMovieId,
    decrementFavoriteMoviesCount,
}