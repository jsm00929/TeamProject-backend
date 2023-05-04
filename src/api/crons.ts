import { readFile } from 'fs/promises';
import cron from 'node-cron';
import path from 'path';
import { writeFile } from 'fs';
import { createGenresIfNotExists } from './tasks';
import { fetchAllGenres, fetchReviewsByMovieId } from './tmdb_fetcher';
import { log } from '../utils/logger';
import { CreateMovieInput } from '../movies/dtos/inputs/create_movie.input';
import { FetchMoviePageDto } from './dtos/fetch_movie_page.dto';
import { tmdbClient } from './tmdb_client';
import moviesRepository from '../movies/movies.repository';
import { prisma } from '../config/db';
import { CreateUserBody } from '../users/dtos/inputs/create_user.body';
import { randomEmail, randomNumber, randomString } from '../utils/rand';
import { setTimeout } from 'timers';

const pagePath = path.join(__dirname, 'page.json');
const movieCountPath = path.join(__dirname, 'movie_count.json');

async function readLastPage() {
  const buf = await readFile(pagePath);
  const { page } = JSON.parse(buf.toString());
  return page;
}

async function readLastMovieCount() {
  const buf = await readFile(movieCountPath);
  const { movieCount } = JSON.parse(buf.toString());
  return movieCount;
}

async function updateLastPage(nextPage: number) {
  const data = JSON.stringify({ page: nextPage });
  await writeFile(pagePath, data, {}, (err) => {});
}

async function updateLastMovieCount(nextMovieCount: number) {
  const data = JSON.stringify({ movieCount: nextMovieCount });
  await writeFile(movieCountPath, data, {}, (err) => {});
}

export async function upsertMovies() {
  const page = await readLastPage();
  try {
    const { data } = await tmdbClient.get<FetchMoviePageDto>(
      `/discover/movie`,
      {
        params: {
          sort_by: 'popularity.desc',
          page,
        },
      },
    );
    log.info(data);
    data.results.forEach(
      async ({
        adult,
        backdropPath,
        genreIds,
        id,
        originalLanguage,
        originalTitle,
        overview,
        popularity,
        posterPath,
        releaseDate,
        title,
        voteAverage,
        voteCount,
      }) => {
        const createMovieDto: CreateMovieInput = {
          adult,
          backdropUrl: backdropPath,
          id,
          lang: originalLanguage,
          overview,
          popularity,
          posterUrl: posterPath,
          releaseDate,
          title,
          voteAverage,
          voteCount,
          genreIds,
        };
        await moviesRepository.upsert(createMovieDto);
      },
    );
  } catch (err) {
    console.log(err);
    log.error((err as Error).message);
    throw err;
  }
  await updateLastPage(page + 1);

  return page;
}

export async function upsertMovieReviews(authorIds: number[]) {
  try {
    // const lastMovieCount = await readLastMovieCount();
    const allMovies = await prisma.movie.findMany();

    for (let i = 0; i < allMovies.length; i++) {
      const movie = allMovies[i];
      if (await prisma.review.findFirst({ where: { movieId: movie.id } })) {
        continue;
      }
      const reviews = await fetchReviewsByMovieId(movie.id);
      console.log('reviews');
      console.log(reviews);

      reviews.forEach(
        async ({
          createdAt,
          updatedAt,
          content,
          authorDetails: { rating },
        }) => {
          const authorId = authorIds[randomNumber(0, authorIds.length - 1)];

          const dto = {
            authorId,
            movieId: movie.id,
            rating: rating === null ? null : Math.floor(rating * 10),
            title: content.slice(0, randomNumber(10, 30)),
            overview: content.slice(0, 100),
            content,
            createdAt,
            updatedAt,
          };

          await setTimeout(() => {}, 10);
          if (
            await prisma.review.findFirst({
              where: {
                AND: [{ movieId: movie.id }, { overview: dto.overview }],
              },
            })
          ) {
            return;
          }
          console.log(dto);
          await prisma.review.create({
            data: dto,
          });
        },
      );
      // await updateLastMovieCount(lastMovieCount + 50);
    }
  } catch (err) {
    log.error(err);
  }
}

export async function createFakeUsers(len: number) {
  const users: CreateUserBody[] = [];
  for (let i = 0; i < len; i++) {
    const dto = new CreateUserBody();
    dto.email = randomEmail();
    dto.password = randomString();
    dto.name = randomString();
    users.push(dto);
  }

  log.info(users);
  try {
    await prisma.user.createMany({
      data: users,
    });
  } catch (error) {
    log.error(error);
  }
}

export function setCrons() {
  // 매일 0시 0분에 모든 장르를 fetch한 뒤,
  // 업데이트 사항이 있으면 DB에 반영
  cron.schedule('0 0 * * *', async () => {
    const genres = await fetchAllGenres();
    log.info(`fetched genres: ${genres}`);
    await createGenresIfNotExists(genres);
  });

  // 1분마다 새로운 movie 업데이트
  cron.schedule('* * * * *', async () => {
    const page = await upsertMovies();
    log.info(`fetched movies page: ${page}`);
  });

  cron.schedule('* * * * *', () => {
    log.info(`it's executed`);
  });
}
