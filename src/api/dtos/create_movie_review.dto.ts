import { CreateMovieReviewBody } from '../../reviews/dtos/create_movie_review.body';

export interface CreateMovieReviewDto
  extends Omit<CreateMovieReviewBody, 'rating'> {
  rating: number | null;
  authorId: number;
  movieId: number;
  overview: string;
  createdAt: Date;
  updatedAt: Date;
}
