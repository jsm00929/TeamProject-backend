import {prisma} from '../../config/db';
import {CreateMovieInput} from '../dtos/inputs/create_movie.input';
import {GenreOutput} from '../dtos/outputs/genre.output';
import {MovieRecord, prismaClient, TxRecord,} from '../../core/types/tx';
import {MoviesPaginationQuery} from '../movies_pagination.query';
import {Genre} from '../dtos/genre.enum';
import {PaginationOutputWith} from "../../core/dtos/outputs/pagination_output";
import {MovieOutput, MovieWithGenresOutput} from "../dtos/outputs/movie.output";
import {RepositoryError} from "../../core/types/repository_error";
import {RepositoryErrorKind} from "../../core/enums/repository_error_kind";
import {RepositoryKind} from "../../core/enums/repository_kind";

// FETCH
async function findMovieById(
    {movieId, tx}: Pick<MovieRecord, 'movieId'> & TxRecord,
): Promise<MovieOutput | null> {
    const movie = await prismaClient(tx).movie.findUnique({
        where: {
            id: movieId,
        },
    });

    if (movie === null) return null;

    return MovieOutput.from(movie);
}

async function findMovieByIdOrThrow(
    {movieId, tx}: Pick<MovieRecord, 'movieId'> & TxRecord,
): Promise<MovieOutput | null> {
    const movieOutput = await findMovieById({movieId, tx});
    if (movieOutput === null) {
        throw RepositoryError.new({
            errorKind: RepositoryErrorKind.NOT_FOUND_ERROR,
            repositoryKind: RepositoryKind.MOVIES_REPOSITORY,
        });
    }
    return movieOutput;
}


async function findMovieWithGenresById(
    {movieId, tx}: Pick<MovieRecord, 'movieId'> & TxRecord,
): Promise<MovieOutput | null> {
    const movieWithGenres = await prismaClient(tx).movie.findUnique({
        where: {
            id: movieId,
        },
        include: {
            genres: true,
        },
    });

    if (movieWithGenres === null) return null;

    return MovieWithGenresOutput.from(movieWithGenres);
}

async function findManyMovies(
    {tx}: TxRecord,
    {
        criteria,
        genre,
        count,
        order,
        after,
        include,
    }: MoviesPaginationQuery,
): Promise<PaginationOutputWith<MovieOutput>> {

    const data = await prismaClient(tx).movie.findMany(
        {
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

    const movieOutputs = data.map((movie) => MovieOutput.from(movie));

    return PaginationOutputWith.from<MovieOutput>({data: movieOutputs, count});
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
//     const movies = await prismaClient(tx).userMovie.findMany({
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
//     return prismaClient(tx).userMovie.findFirst({
//         where: {
//             userId,
//             movieId,
//         },
//     });
// }

async function findMovieDetailById(
    {
        movieId,
        tx,
    }: Pick<MovieRecord, 'movieId'> & TxRecord
): Promise<MovieOutput | null> {
    return findMovieById({movieId, tx});
}


async function createMany({tx}: TxRecord, data: CreateMovieInput[]) {
    await prisma.movie.createMany({
        data: [],
    });
}

async function findAllGenres() {
    return prisma.genre.findMany();
}

async function upsert(
    {
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
    findMovieById,
    findMovieWithGenresById,
    findManyMovies,
    findMovieDetailById,
    createMany,
    findAllGenres,
    upsert,
    upsertGenre,
};
