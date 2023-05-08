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

async function updateLatestHistoryId(
    {userId, nextId, tx}: PickIdsWithTx<'user'>
        & { nextId: number | null }
) {
    await tx.movieMetaData.update({
        where: {
            userId,
        },
        data: {
            latestHistoryId: nextId,
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

async function incrementMovieHistoriesCount({userId, tx}: PickIdsWithTx<'user'>) {
    await tx.movieMetaData.update({
        where: {
            userId,
        },
        data: {
            historiesCount: {
                increment: 1,
            },
        },
    });
}

async function incrementMovieLikesCount({userId, tx}: PickIdsWithTx<'user'>) {
    await tx.movieMetaData.update({
        where: {
            userId,
        },
        data: {
            likesCount: {
                increment: 1,
            },
        },
    });
}

async function incrementFavoriteMoviesCount({userId, tx}: PickIdsWithTx<'user'>) {
    await tx.movieMetaData.update({
        where: {
            userId,
        },
        data: {
            favoritesCount: {
                increment: 1,
            },
        },
    });
}

async function decrementMovieHistoriesCount({userId, tx}: PickIdsWithTx<'user'>) {
    await tx.movieMetaData.update({
        where: {
            userId,
        },
        data: {
            historiesCount: {
                decrement: 1,
            },
        },
    });
}

async function decrementMovieLikesCount({userId, tx}: PickIdsWithTx<'user'>) {
    await tx.movieMetaData.update({
        where: {
            userId,
        },
        data: {
            likesCount: {
                decrement: 1,
            },
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
    findByUserId,
    createAndReturn,
    softDeleteByUserId,
    updateLatestHistoryId,
    updateLatestMovieLikeId,
    updateLatestFavoriteMovieId,
    incrementMovieHistoriesCount,
    incrementMovieLikesCount,
    incrementFavoriteMoviesCount,
    decrementMovieHistoriesCount,
    decrementFavoriteMoviesCount,
    decrementMovieLikesCount,
}