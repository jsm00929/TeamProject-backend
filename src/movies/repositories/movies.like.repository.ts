// FETCH
import {PickIdsWithTx} from "../../core/types/pick_ids";
import {PaginationQuery} from "../../core/dtos/inputs";
import {PaginationOutput} from "../../core/dtos/outputs/pagination_output";
import {LikedMovie, MovieWithGenresOutput} from "../dtos/outputs/movie_with_genres.output";
import {nullOrFirst} from "../../utils/null_or_first";

async function findByUserIdAndMovieId(
    {userId, movieId, tx}: PickIdsWithTx<'user' | 'movie'>,
) {
    return tx.likeMovie.findFirst({
        where: {
            movieId,
            userId,
        },
    });
}

async function findNextById(
    {movieLikeId, userId, tx}: PickIdsWithTx<'movieLike' | 'user'>,
) {
    const entities = await tx.likeMovie.findMany({
        where: {
            userId,
        },
        orderBy: {
            updatedAt: 'desc',
        },
        cursor: {id: movieLikeId},
        skip: 1,
        take: 1,
    });

    return nullOrFirst(entities);
}

async function findManyLikedMoviesByUserId(
    {userId, tx}: PickIdsWithTx<'user'>,
    {count, after, cursor}: PaginationQuery & { cursor?: number },
) {

    let likes: LikedMovie[] = [];

    // 1.
    if (after || cursor) {
        likes =
            await tx.likeMovie.findMany({
                where: {
                    userId,
                },
                orderBy: {
                    updatedAt: 'desc',
                },
                cursor: {
                    id: after ? after : cursor,
                },
                skip: after ? 1 : 0,
                take: count + 1,
                include: {
                    movie: {
                        include: {
                            genres: true,
                        },
                    },
                },
            });
    }

    const data = likes.map(l => MovieWithGenresOutput.from(l.movie));
    return PaginationOutput.from(data, count);


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

async function restore(
    {movieLikeId, tx}: PickIdsWithTx<'movieLike'>,
) {
    return tx.likeMovie.update({
        where: {
            id: movieLikeId,
        },
        data: {
            deletedAt: null,
        },
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
    findNextById,
    findManyLikedMoviesByUserId,
    create,
    softDeleteById,
    restore,
}