import {prisma} from '../../config/db';
import {CreateMovieBody} from '../dtos/inputs/create_movie.body';
import {GenreOutput} from '../dtos/outputs/genre.output';
import {Tx, UserRecord} from '../../core/types/tx';
import {MoviesPaginationQuery} from '../dtos/inputs/movies_pagination.query';
import {Genre} from '../dtos/genre.enum';
import {PaginationOutput} from '../../core/dtos/outputs/pagination_output';
import {MovieOutput} from '../dtos/outputs/movie.output';
import {PickIdsWithTx} from '../../core/types/pick_ids';
import {MovieWithGenres} from '../dtos/movie_with_genres';
import {MovieWithGenresOutput} from '../dtos/outputs/movie_with_genres.output';
import {isDeleted} from "../../utils/is_null_or_deleted";

// FETCH
async function findMovieById(
    {
        userId,
        movieId,
        tx,
    }: Partial<Pick<UserRecord, 'userId'>> & PickIdsWithTx<'movie'>
): Promise<MovieOutput | null> {
    const queries: any[] = [
        tx.movie.findUnique({
            where: {
                id: movieId,
            },
            include: {
                genres: true,
            },
        }),
    ];

    if (userId) {
        queries.push(tx.likeMovie.findFirst({where: {movieId, userId}}));
        queries.push(tx.favoriteMovie.findFirst({where: {movieId, userId}}));
    }

    const [entity, isLiked, isFavorite] = await Promise.all(queries);

    await tx.likeMovie.findFirst({where: {movieId, userId}});
    return MovieWithGenresOutput.nullOrFrom(entity, {isLiked, isFavorite});
}

async function findMovieWithGenresById(
    {
        movieId,
        tx,
    }: PickIdsWithTx<'movie'>): Promise<MovieWithGenresOutput | null> {
    const entity: MovieWithGenres | null = await tx.movie.findUnique({
        where: {
            id: movieId,
        },
        include: {
            genres: true,
        },
    });
    return MovieWithGenresOutput.nullOrFrom(entity);
}

async function findManyMovies(
    {tx}: { tx: Tx },
    {criteria, genre, count, order, after, include}: MoviesPaginationQuery,
): Promise<PaginationOutput<MovieWithGenresOutput>> {
    const entities = await tx.movie.findMany({
        orderBy: {
            [criteria]: order,
        },
        where:
            genre !== Genre.ALL
                ? {
                    genres: {
                        some: {
                            name: genre,
                        },
                    },
                }
                : {},
        ...(after !== undefined && {cursor: {id: after}}),
        skip: after ? 1 : 0,
        take: count + 1,
        include: {
            genres: true,
        },
    });

    const data = entities
        .filter(m => !isDeleted(m))
        .map((m) => MovieWithGenresOutput.from(m));

    return PaginationOutput.from(data, count);
}

async function findManyMoviesWithGenres(
    {tx}: { tx: Tx },
    {criteria, genre, count, order, after, include}: MoviesPaginationQuery,
): Promise<PaginationOutput<MovieWithGenresOutput>> {
    const entities: MovieWithGenres[] = await tx.movie.findMany({
        orderBy: {
            [criteria]: order,
        },
        where:
            genre !== Genre.ALL
                ? {
                    genres: {
                        some: {
                            name: genre,
                        },
                    },
                }
                : {},
        ...(after !== undefined && {cursor: {id: after}}),
        skip: after ? 1 : 0,
        take: count + 1,
        include: {
            genres: true,
            ...(include !== undefined && {[include]: true}),
        },
    });

    const data = entities
        .filter(m => !isDeleted(m))
        .map((m) => MovieWithGenresOutput.from(m));

    return PaginationOutput.from(data, count);
}

//
// async function findManyByUserId(
//     {userId, tx}: Pick<UserRecord, 'userId'> & TxRecord,
//     {
//         count,
//         after,
//         filter,
//         include,
//     }: UserMoviesPaginationQuery,
// ) {
//     const movies = await tx.userMovie.findMany({
//         orderBy: {
//             viewedAt: 'desc',
//         },
//         where:
//             {
//                 userId,
//
//             },
//         ...(after !== undefined && {cursor: {id: after}}),
//         skip: after !== undefined ? 1 : 0,
//         take: count + 1,
//
//     });
//
//     console.log(movies);
//
//     const res = {
//         movies,
//         hasMore: false,
//     };
//
//
//     if (movies.length > count) {
//         res.hasMore = true;
//         movies.pop();
//     }
//
//     return res;
// }
//
// async function findUserMovie(
//     {userId, movieId, tx}: Pick<UserRecord, 'userId'> & Pick<MovieRecord, 'movieId'> & TxRecord,
// ) {
//     return tx.userMovie.findFirst({
//         where: {
//             userId,
//             movieId,
//         },
//     });
// }

async function findDetailById(
    {
        movieId,
        tx,
    }: PickIdsWithTx<'movie'>): Promise<MovieOutput | null> {
    return findMovieById({movieId, tx});
}

async function createMany({tx}: { tx: Tx }, data: CreateMovieBody[]) {
    await prisma.movie.createMany({
        data: [],
    });
}

async function findAllGenres() {
    return prisma.genre.findMany();
}

async function upsert({
                          adult,
                          backdropUrl,
                          genreIds,
                          id,
                          lang,
                          overview,
                          popularity,
                          posterUrl,
                          releaseDate,
                          title,
                          voteAverage,
                          voteCount,
                          overviewKo,
                          titleKo,
                      }: CreateMovieBody) {
    await prisma.$transaction(async (prisma) => {
        await prisma.movie.upsert({
            create: {
                adult,
                id,
                lang,
                overview,
                popularity,
                releaseDate: releaseDate ? new Date(releaseDate) : null,
                title,
                voteAverage,
                voteCount,
                backdropUrl: `https://image.tmdb.org/t/p/original${backdropUrl}`,
                overviewKo,
                posterUrl: `https://image.tmdb.org/t/p/original${posterUrl}`,
                titleKo,
                genres: {
                    connect: genreIds.map((genreId) => ({id: genreId})),
                },
            },
            update: {},
            where: {
                id,
            },
        });
        // await prisma.movieGenre.createMany({
        //   data: genreIds.map((genreId) => ({
        //     movieId: id,
        //     genreId: genreId,
        //   })),
        // });
    });
}

async function upsertGenre({id, name}: GenreOutput) {
    await prisma.genre.upsert({
        create: {
            id,
            name,
        },
        update: {
            name,
        },
        where: {
            id,
        },
    });
}

export default {
    findMovieById,
    findMovieWithGenresById,
    findManyMovies,
    findManyMoviesWithGenres,
    findDetailById,
    createMany,
    findAllGenres,
    upsert,
    upsertGenre,
};
