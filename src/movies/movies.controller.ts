import moviesService from './movies.service';
import {AuthRequestWith, RequestWith} from '../core/types/request_with';
import {MovieIdParams} from './dtos/inputs/get_movie_detail.params';
import {AppResult} from '../core/types/app_result';
import reviewsService from '../reviews/reviews.service';
import {EditMovieReviewBody} from '../reviews/dtos/edit_review.body';
import {ReviewIdParams} from '../reviews/dtos/review_id.params';
import {CreateMovieReviewBody} from '../reviews/dtos/create_movie_review.body';
import {HttpStatus} from '../core/constants';
import {MoviesPaginationQuery} from './movies_pagination.query';

async function movies(req: RequestWith<MoviesPaginationQuery>) {
    const {after, count, include, genre, order, criteria} = req.unwrap();
    const movies = await moviesService.movies({criteria, order, genre, include, count, after});

    return AppResult.new({
        body: movies,
    })
}

// async function popularMovies(req: RequestWith<PaginationQuery>) {
//     const {unwrapCursor, after: skip, count: take} = req.unwrap();
//     const movies = await moviesService.popularMovies({
//         after: skip,
//         count: take,
//         unwrapCursor,
//     });
//
//     return AppResult.new({body: movies});
// }

async function movieDetail(req: AuthRequestWith<never, MovieIdParams>) {
    const userId = req.userId;
    const {movieId} = req.unwrapParams();
    const movieDetail = await moviesService.movieDetail({userId, movieId});

    return AppResult.new({body: movieDetail});
}

/**
 * Movie Reviews
 */

async function writeReview(
    req: AuthRequestWith<CreateMovieReviewBody, MovieIdParams>,
) {
    const {userId} = req;
    const {movieId} = req.unwrapParams();
    const body = req.unwrap();

    const reviewId = await reviewsService.write(
        {
            userId,
            movieId,
        },
        body,
    );

    return AppResult.new({
        body: {reviewId},
        status: HttpStatus.CREATED,
    });
}

async function editReview(
    req: AuthRequestWith<EditMovieReviewBody, ReviewIdParams>,
) {
    const userId = req.userId;
    const editReviewInput = req.unwrap();
    const {reviewId} = req.unwrapParams();

    await reviewsService.edit({userId, reviewId}, editReviewInput);
}

async function removeReview(req: AuthRequestWith<never, ReviewIdParams>) {
    const userId = req.userId;
    const {reviewId} = req.unwrapParams();

    await reviewsService.remove({userId, reviewId});
}

export default {
    movies,
    movieDetail,
    writeReview,
    editReview,
    removeReview,
};
