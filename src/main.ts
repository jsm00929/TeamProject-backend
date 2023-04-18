import { setCrons, upsertMovies } from './api/crons';
import { App } from './app';
import moviesRepository from './movies/movies.repository';
import { log } from './utils/logger';

async function main() {
  // setCrons();
  // const page = await upsertMovies();
  // log.info(`fetched movies page: ${page}`);
  App.start();

  // const data = await moviesRepository.getPopularMovies();
}

main();
