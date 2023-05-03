import {prisma} from '../config/db';
import {MovieRecord, UserRecord} from '../core/types/tx';
import usersRepository from '../users/users.repository';
import moviesRepository from './movies.repository';
import {MoviesPaginationQuery, UserMoviesPaginationQuery} from './movies_pagination.query';
import {PaginationOutputWith} from "../core/dtos/outputs/pagination_output";
import {movieEntityIntoMovieOutput, MovieOutput} from "./dtos/outputs/movie.output";

/**
 * FETCH
 */
async function movies({
                          count,
                          after,
                          criteria,
                          order,
                          genre,
                          include,
                      }: MoviesPaginationQuery) {
    const {movies, hasMore} = await moviesRepository.findMany(
        {},
        {count, after, order, criteria, genre, include},
    );

    return {
        data: movies.map((movie) => movieEntityIntoMovieOutput(movie)),
        meta: {
            count,
            hasMore,
        },
    } as PaginationOutputWith<MovieOutput>;
}

async function userMovies(
    {userId}: Pick<UserRecord, 'userId'>,
    {count, after, include, filter}: UserMoviesPaginationQuery,
) {
    return moviesRepository.findManyByUserId(
        {userId},
        {count, after, include, filter},
    );
}


async function movieDetail({
                               userId,
                               movieId,
                           }: Partial<Pick<UserRecord, 'userId'>> & Pick<MovieRecord, 'movieId'>) {
    await prisma.$transaction(async (tx) => {
        if (
            userId &&
            (await usersRepository.findById({userId, tx}))?.deletedAt === null
        ) {
            await moviesRepository.updateUserMovie(
                {userId, movieId, tx},
                {viewedAt: new Date()},
            );
        }

        return moviesRepository.findMovieDetailById({movieId});
    });
}

async function toggleFavoriteMovie({
                                       userId,
                                       movieId,
                                   }: Pick<UserRecord, 'userId'> & Pick<MovieRecord, 'movieId'>
) {
    await moviesRepository.toggleFavoriteMovie({userId, movieId});
}

export default {
    movies,
    userMovies,
    movieDetail,
    toggleFavoriteMovie,
};
