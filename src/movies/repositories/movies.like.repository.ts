// FETCH
import {PickIdsWithTx} from "../../core/types/pick_ids";

async function findByUserIdAndMovieId(
    {userId, movieId, tx}: PickIdsWithTx<'user' | 'movie'>,
) {
    return tx.likeMovie.findFirst({
        where: {
            movieId,
            userId,
        }
    });
}

async function create(
    {userId, movieId, tx}: PickIdsWithTx<'user' | 'movie'>,
) {
    return tx.likeMovie.create({
        data: {
            movieId,
            userId,
        }
    });
}

async function softDeleteById(
    {movieLikeId, tx}: PickIdsWithTx<'movieLike'>,
) {
    return tx.likeMovie.update({
        where: {
            id: movieLikeId,
        },
        data: {
            deletedAt: new Date(),
        },
    });
}

export default {
    findByUserIdAndMovieId,
    create,
    softDeleteById,
}