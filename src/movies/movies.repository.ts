import {prisma} from '../config/db';
import {CreateMovieInput} from './dtos/inputs/create_movie.input';
import {GenreOutput} from './dtos/outputs/genre.output';
import {MovieRecord, prismaClient, TxRecord, UserMovieRecord, UserRecord,} from '../core/types/tx';
import {MoviesPaginationQuery, UserMoviesPaginationQuery} from './movies_pagination.query';
import {Genre} from './genre.enum';

// FETCH
async function findById(
    {movieId, tx}: Pick<MovieRecord, 'movieId'> & TxRecord,
    include?: Partial<{ genres: boolean }>,
) {
    return prismaClient(tx).movie.findUnique({
        where: {
            id: movieId,
        },
        ...(include !== undefined && {include}),
    });
}

async function findMany(
    {tx}: TxRecord,
    {
        criteria,
        genre,
        count,
        order,
        after,
        include,
    }: MoviesPaginationQuery,
) {

    const movies = await prismaClient(tx).movie.findMany({
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
        skip: after !== undefined ? 1 : 0,
        take: count + 1,
        include: {
            genres: true,
            ...(include !== undefined && {[include]: true})
        },
    });

    const res = {
        movies,
        hasMore: false,
    };


    if (movies.length > count) {
        res.hasMore = true;
        movies.pop();
    }

    return res;
}

async function findManyByUserId(
    {userId, tx}: Pick<UserRecord, 'userId'> & TxRecord,
    {
        count,
        after,
        filter,
        include,
    }: UserMoviesPaginationQuery,
) {
    const movies = await prismaClient(tx).userMovie.findMany({
        orderBy: {
            viewedAt: 'desc',
        },
        where:
            {
                userId,

            },
        ...(after !== undefined && {cursor: {id: after}}),
        skip: after !== undefined ? 1 : 0,
        take: count + 1,

    });

    console.log(movies);

    const res = {
        movies,
        hasMore: false,
    };


    if (movies.length > count) {
        res.hasMore = true;
        movies.pop();
    }

    return res;
}

async function findMovieDetailById({
                                       movieId,
                                       tx,
                                   }: Pick<MovieRecord, 'movieId'> & TxRecord) {
    return findById({movieId, tx}, {genres: true});
}


async function findUserMovies({
                                  userId,
                                  movieId,
                                  tx,
                              }: Pick<UserRecord, 'userId'> & Pick<MovieRecord, 'movieId'> & TxRecord) {
    return prismaClient(tx).userMovie.findFirst({
        where: {
            userId,
            movieId,
        },
    });
}

// MUTATION
async function updateUserMovie(
    {
        userId,
        movieId,
        tx,
    }: Pick<UserRecord, 'userId'> & Pick<MovieRecord, 'movieId'> & TxRecord,
    data: Partial<UserMovieRecord>,
) {
    await prismaClient(tx).userMovie.update({
        where: {
            id: (await findUserMovies({userId, movieId, tx}))!.id,
        },
        data,
    });
}

// TODO:
async function toggleFavoriteMovie({
                                       userId,
                                       movieId,
                                   }: Pick<UserRecord, 'userId'> & Pick<MovieRecord, 'movieId'>) {
    await prisma.$transaction(async (prisma) => {
        let userMovie = await prisma.userMovie.findFirst({
            where: {
                userId,
                movieId,
            },
        });

        if (!userMovie) {
            userMovie = await prisma.userMovie.create({
                data: {
                    userId,
                    movieId,
                },
            });
        }

        await prisma.userMovie.update({
            where: {
                id: userMovie.id,
            },
            data: {
                isFavorite: !userMovie.isFavorite,
            },
        });
    });
}

async function updateViewedAt({
                                  userId,
                                  movieId,
                                  tx,
                              }: Pick<UserRecord, 'userId'> & Pick<MovieRecord, 'movieId'> & TxRecord) {
    await prisma.$transaction(async (tx) => {
        let userMovie = await prismaClient(tx).userMovie.findFirst({
            where: {
                userId,
                movieId,
            },
        });

        if (!userMovie) {
            userMovie = await prismaClient(tx).userMovie.create({
                data: {
                    userId,
                    movieId,
                },
            });
        }

        await prismaClient(tx).userMovie.update({
            where: {
                id: userMovie.id,
            },
            data: {
                viewedAt: new Date(),
            },
        });
    });
}

// 최근 본 영화 목록 지우기

// async function getRecentlyViewed(
//     {userId, tx}: Pick<UserRecord, 'userId'> & TxRecord,
//     {skip, take}: PaginationQuery,
// ) {
//     return prisma.userMovie.findMany({
//         where: {
//             userId,
//         },
//         orderBy: {
//             viewedAt: 'desc',
//         },
//         include: {
//             movie: true,
//         },
//         skip,
//         take,
//     });
// }

// async function favorites(
//     {userId, tx}: Pick<UserRecord, 'userId'> & TxRecord,
//     {skip, take}: PaginationQuery) {
//     return prisma.userMovie.findMany({
//         where: {
//             userId,
//             isFavorite: true,
//         },
//         orderBy: {
//             viewedAt: 'desc',
//         },
//         include: {
//             movie: true,
//         },
//         skip,
//         take,
//     });
// }

// async function getRecentlyViewedMovies(
//   userId: number,
//   { skip, take }: PaginationQuery,
// ) {
//   const movies =
//     (
//       await prisma.user.findUnique({
//         where: { id: userId },
//         include: {
//           movies: {
//             orderBy: {
//               viewedAt: 'desc',
//             },
//             skip,
//             take,
//             include: {
//               movie: true,
//             },
//           },
//         },
//       })
//     )?.movies ?? [];
//   return movies.map((m) => m.movie);
// }


async function createMany({tx}: TxRecord, data: CreateMovieInput[]) {
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
                      }: CreateMovieInput) {
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
    findById,
    findMany,
    findManyByUserId,
    findMovieDetailById,
    toggleFavoriteMovie,
    updateUserMovie,
    updateViewedAt,
    createMany,
    findAllGenres,
    upsert,
    upsertGenre,
};
