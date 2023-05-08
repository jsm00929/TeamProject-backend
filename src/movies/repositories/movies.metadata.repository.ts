import {PickIdsWithTx} from "../../core/types/pick_ids";

async function findByUserId({userId, tx}: PickIdsWithTx<'user'>) {
    return tx.movieMetaData.findUnique({
        where: {
            userId,
        }
    });
}

async function createAndReturn({userId, tx}: PickIdsWithTx<'user'>) {
    return tx.movieMetaData.create({
        data: {
            userId,
        },
    });
}

async function updateLatestHistoryId({userId, movieHistoryId, tx}: PickIdsWithTx<'user' | 'movieHistory'>) {
    await tx.movieMetaData.update({
        where: {
            userId,
        },
        data: {
            latestHistoryId: movieHistoryId,
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
    findByUserId,
    createAndReturn,
    softDeleteByUserId,
    updateLatestHistoryId,
    updateLatestMovieLikeId,
    updateLatestFavoriteMovieId,
}