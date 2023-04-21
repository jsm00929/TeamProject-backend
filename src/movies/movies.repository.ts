import { PaginationQuery } from '../core/dtos/inputs';
import { prisma } from '../config/db';
import { CreateMovieInput } from './dtos/inputs/create_movie.input';
import { GenreOutput } from './dtos/outputs/genre.output';
import { MoviesPaginationQuery } from './dtos/inputs/movies_pagination.query';
import { Genre } from './dtos/genre';

async function toggleFavoriteMovie(userId: number, movieId: number) {
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

async function updateViewedAt(userId: number, movieId: number) {
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
        viewedAt: new Date(),
      },
    });
  });
}

async function getRecentlyViewed(
  userId: number,
  { skip, take }: PaginationQuery,
) {
  const movies = await prisma.userMovie.findMany({
    where: {
      userId,
    },
    orderBy: {
      viewedAt: 'desc',
    },
    include: {
      movie: true,
    },
    skip,
    take,
  });

  return movies;
}

async function getFavorites(userId: number, { skip, take }: PaginationQuery) {
  const movies = await prisma.userMovie.findMany({
    where: {
      userId,
      isFavorite: true,
    },
    orderBy: {
      viewedAt: 'desc',
    },
    include: {
      movie: true,
    },
    skip,
    take,
  });

  return movies;
}

async function getMovieDetail(movieId: number) {
  return prisma.movie.findUnique({
    where: {
      id: movieId,
    },
    include: {
      genres: true,
    },
  });
}

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

async function findMany({
  skip,
  take,
  genre,
  /**
   * DB 내의 모든 row의 adult column이 모두 0이라 필터링 불가하여 제거됨.
   */
  // isAdult,
  order,
  criteria,
}: MoviesPaginationQuery) {
  return prisma.movie.findMany({
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
    /**
     * DB 내의 모든 row의 adult column이 모두 0이라 필터링 불가하여 제거됨.
     */
    // ...(isAdult !== undefined && {
    //   adult: isAdult ? 1 : 0,
    // }),
    skip,
    take,
    include: {
      genres: true,
    },
  });
}

async function getPopularMovies({ skip, take }: PaginationQuery) {
  return prisma.movie.findMany({
    orderBy: [
      {
        popularity: 'desc',
      },
      {
        releaseDate: 'desc',
      },
    ],
    skip,
    take,
    include: {
      genres: true,
    },
  });
}

async function createMany(createMovieDtos: CreateMovieInput[]) {
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
          connect: genreIds.map((genreId) => ({ id: genreId })),
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

async function upsertGenre({ id, name }: GenreOutput) {
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
  findMany,
  toggleFavoriteMovie,
  updateViewedAt,
  getMovieDetail,
  getPopularMovies,
  createMany,
  findAllGenres,
  upsert,
  upsertGenre,
  getRecentlyViewed,
  getFavorites,
};
