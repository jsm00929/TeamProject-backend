import { readFile } from 'fs/promises';
import cron from 'node-cron';
import path from 'path';
import { writeFile } from 'fs';
import { createGenresIfNotExists } from './tasks';
import { fetchAllGenres } from './tmdb_fetcher';
import { logger } from '../utils/logger/logger';
import { CreateMovieInput } from '../movies/dtos/inputs/create_movie.input';
import { FetchMoviePageDto } from './dtos/fetch_movie_page.dto';
import { tmdbClient } from './tmdb_client';
import moviesRepository from '../movies/movies.repository';

const pagePath = path.join(__dirname, 'page.json');

async function readLastPage() {
  const buf = await readFile(pagePath);
  const { page } = JSON.parse(buf.toString());
  console.log(page);
  return page;
}

async function updateLastPage(nextPage: number) {
  const data = JSON.stringify({ page: nextPage });
  await writeFile(pagePath, data, {}, (err) => {});
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
    logger.info(data);
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
    logger.error((err as Error).message);
    throw err;
  }
  await updateLastPage(page + 1);

  return page;
}

export function setCrons() {
  // 매일 0시 0분에 모든 장르를 fetch한 뒤,
  // 업데이트 사항이 있으면 DB에 반영
  cron.schedule('0 0 * * *', async () => {
    const genres = await fetchAllGenres();
    logger.info(`fetched genres: ${genres}`);
    await createGenresIfNotExists(genres);
  });

  // 1분마다 새로운 movie 업데이트
  cron.schedule('* * * * *', async () => {
    const page = await upsertMovies();
    logger.info(`fetched movies page: ${page}`);
  });

  cron.schedule('* * * * *', () => {
    logger.info(`it's executed`);
  });
}
