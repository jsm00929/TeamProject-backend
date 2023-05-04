// FETCH
import {LikeMovieRecord, MovieRecord, prismaClient, TxRecord, UserRecord} from "../../core/types/tx";

async function findByUserIdAndMovieId(
    {userId, movieId, tx}: Pick<UserRecord, 'userId'> & Pick<MovieRecord, 'movieId'> & TxRecord,
) {
    return prismaClient(tx).likeMovie.findFirst({
        where: {
            movieId,
            userId,
        }
    });
}

async function create(
    {userId, movieId, tx}: Pick<UserRecord, 'userId'> & Pick<MovieRecord, 'movieId'> & TxRecord,
) {
    return prismaClient(tx).likeMovie.create({
        data: {
            movieId,
            userId,
        }
    });
}

async function removeById(
    {likeMovieId, tx}: Pick<LikeMovieRecord, 'likeMovieId'> & TxRecord,
) {
    return prismaClient(tx).likeMovie.delete({
        where: {
            id: likeMovieId,
        }
    });
}

export default {
    findByUserIdAndMovieId,
    create,
    removeById,
}