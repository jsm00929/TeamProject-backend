import {PaginationQuery} from '../../core/dtos/inputs';
import {PaginationOutput} from '../../core/dtos/outputs/pagination_output';
import {PickIdsWithTx} from '../../core/types/pick_ids';
import {nullOrFirst} from "../../utils/null_or_first";
import {MovieWithGenresOutput} from "../dtos/outputs/movie_with_genres.output";
import {FavoriteMovie, Genre, Movie} from "@prisma/client";

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


    // TODO
    return PaginationOutput.from(entities, count);
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

async function softDeleteById(
    {
        favoriteMovieId,
        tx,
    }: PickIdsWithTx<'favoriteMovie'>) {
    return tx.favoriteMovie.update({
        where: {
            id: favoriteMovieId,
        },
        data: {
            deletedAt: new Date(),
        },
    });
}

async function restore(
    {
        favoriteMovieId,
        tx,
    }: PickIdsWithTx<'favoriteMovie'>) {
    return tx.favoriteMovie.update({
        where: {
            id: favoriteMovieId,
        },
        data: {
            deletedAt: null,
        },
    });
}

async function findNextById(
    {favoriteMovieId, userId, tx}: PickIdsWithTx<'favoriteMovie' | 'user'>,
) {
    const entities = await tx.favoriteMovie.findMany({
        where: {
            userId,
        },
        orderBy: {
            updatedAt: 'desc',
        },
        cursor: {id: favoriteMovieId},
        skip: 1,
        take: 1,
    });

    return nullOrFirst(entities);
}


async function findManyFavoriteMoviesByUserId(
    {userId, tx}: PickIdsWithTx<'user'>,
    {count, after, cursor}: PaginationQuery & { cursor?: number },
) {

    let favorites: (FavoriteMovie & { movie: Movie & { genres: Genre[] } })[] = [];

    // 1.
    if (after || cursor) {
        favorites =
            await tx.favoriteMovie.findMany({
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

    const data = favorites
        .map(f =>
            MovieWithGenresOutput.from(f.movie));

    console.log(data);
    return PaginationOutput.from(data, count);


}

export default {
    findByUserIdAndMovieId,
    findManyFavoriteMoviesByUserId,
    findNextById,
    create,
    softDeleteById,
    restore,
};
