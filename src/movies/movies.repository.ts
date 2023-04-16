import { PaginationQuery } from '../core/dtos/inputs/pagination.query';
import { prisma } from '../config/db';
import { CreateMovieInput } from './dtos/inputs/create_movie.input';
import { GenreOutput } from './dtos/outputs/genre.output';

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

async function getRecentlyViewedMovies(
  userId: number,
  { skip, take }: PaginationQuery,
) {
  const movies =
    (
      await prisma.user.findUnique({
        where: { id: userId },
        include: {
          movies: {
            orderBy: {
              viewedAt: 'desc',
            },
            skip,
            take,
            include: {
              movie: true,
            },
          },
        },
      })
    )?.movies ?? [];
  return movies.map((m) => m.movie);
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
  toggleFavoriteMovie,
  updateViewedAt,
  getMovieDetail,
  getRecentlyViewedMovies,
  getPopularMovies,
  createMany,
  findAllGenres,
  upsert,
  upsertGenre,
};
