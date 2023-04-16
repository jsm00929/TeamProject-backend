import { Router } from 'express';
import { PaginationQuery } from '../core/dtos/inputs';
import reviewsController from './reviews.controller';
import { CreateMovieReviewBody } from './dtos/create_movie_review.body';
import { ReviewIdParams } from './dtos/review_id.params';
import { EditMovieReviewBody } from './dtos/edit_review.body';
import { handle } from '../core/handle';

const reviewsRouter = Router();

export default reviewsRouter;
