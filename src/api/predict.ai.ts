import axios from "axios";
import { AI_PREDICT_BASE_URL } from "../config/constants";
import moviesService from "../movies/services/movies.service";
import { Genre } from "../movies/dtos/genre.enum";
import { MovieSortingCriteria } from "../movies/dtos/inputs/movies_pagination.query";
import reviewsService from "../reviews/reviews.service";
import { log } from "../utils/logger";
import moviesRepository from "../movies/repositories/movies.repository";

export interface PredictAiDto {
  id: number;
  movie_id: number;
  content: string;
}

export interface PredictAiResultDto {
  id: number;
  movie_id: number;
  result: boolean;
}

export interface FindPredictAiResultDto {
  reviewId: number;
  movieId: number;
  after?: number;
}

// REQUEST FOR REVIEW PREDICT API TO FASTAPI SERVER
export async function predictAi(dto: PredictAiDto) {
  await aiClient.post("/ai/predict", dto);
}

const aiClient = axios.create({
  baseURL: AI_PREDICT_BASE_URL,
});

const tenSecs = () => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(null);
    }, 10 * 1000)
  );
};

export async function doAi(after?: number) {
  const movies = await moviesService.movies({
    after,
    count: 20,
    order: "desc",
    genre: Genre.ALL,
    criteria: MovieSortingCriteria.RELEASE_DATE,
  });

  movies.data.forEach(async (movie) => {
    await aiPredictSchedule(movie.id);
  });
}

async function aiPredictSchedule(movieId: number) {
  let count = 0;

  const reviews = await reviewFetch(movieId);
  reviews.forEach(async ({ content, id }) => {
    // 10초 기다리고 요청 보내기 ... .
    await predictAi({ id, content, movie_id: movieId });
    await tenSecs();
    ++count;
    log.info(
      "\n[total processed: {} ✅]\n [alert🦑]: last processed movieId: {}, review Id: {}\n",
      count,
      movieId,
      id
    );
  });
}

async function reviewFetch(movieId: number) {
  const { data } = await reviewsService.reviewsByMovieId(
    { movieId },
    { count: 20 }
  );
  return data.map(({ id, content }) => ({ id, content }));
}
