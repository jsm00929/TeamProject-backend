import {
  createFakeUsers,
  setCrons,
  upsertMovieReviews,
  upsertMovies,
} from './api/crons';
import { App } from './app';
import { prisma } from './config/db';
import moviesRepository from './movies/movies.repository';
import { log } from './utils/logger';
import { randomNumber } from './utils/rand';

async function main() {
  // setCrons();
  // const page = await upsertMovies();
  // log.info(`fetched movies page: ${page}`);
  App.start();
  // await upsertMovieReviews(userIds);
  // await createFakeUsers(1000);
  // const data = await moviesRepository.getPopularMovies();
}

main();
