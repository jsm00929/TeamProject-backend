import {ErrorMessages} from '../core/constants/error_messages';
import {HttpStatus} from '../core/constants/http_status';
import {PaginationQuery} from '../core/dtos/inputs/pagination.query';
import {AppError} from '../core/types/app_error';
import {CreateMovieReviewBody} from './dtos/create_movie_review.body';
import {EditMovieReviewBody} from './dtos/edit_review.body';
import reviewsRepository from './reviews.repository';
import {prisma} from "../config/db";
import {MovieRecord, ReviewRecord, UserRecord} from "../core/types/tx";

async function getReviewDetail({reviewId}: Pick<ReviewRecord, 'reviewId'>) {
    return reviewsRepository.findById({reviewId});
}

// TODO: Pagination
async function getReviewOverviewsByUserId(
    {
        userId,
        skip,
        take,
    }
        : Pick<UserRecord, 'userId'> & PaginationQuery,
) {
    return reviewsRepository.findManyByAuthorId(userId, {skip, take});
}

async function write(
    {userId, movieId}: Pick<UserRecord, 'userId'> & Pick<MovieRecord, 'movieId'>,
    {rating, content, title}: CreateMovieReviewBody,
) {
    let reviewId: number | undefined;

    await prisma.$transaction(async tx => {
            reviewId = await reviewsRepository.create({tx, userId, movieId}, {title, content, rating});
            await reviewsRepository.createRating({tx, movieId, rating});
        }
    );

    return reviewId;
}

async function edit(
    {
        userId,
        reviewId,
    }: Pick<ReviewRecord, 'reviewId'> & Pick<UserRecord, 'userId'>,
    body: EditMovieReviewBody,
) {

    return prisma.$transaction(async tx => {

        const exists = await reviewsRepository.isExists({reviewId, tx});
        if (!exists) {
            throw AppError.new({
                message: ErrorMessages.NOT_FOUND,
                status: HttpStatus.NOT_FOUND,
            });
        }

        const isAuthor = await reviewsRepository.isAuthor({userId, reviewId, tx});
        if (!isAuthor) {
            throw AppError.new({
                message: ErrorMessages.PERMISSION_DENIED,
                status: HttpStatus.FORBIDDEN,
            });
        }

        await reviewsRepository.update({reviewId}, body);
    });

}

async function remove({userId, reviewId}: Pick<UserRecord, 'userId'> & Pick<ReviewRecord, 'reviewId'>) {

    return prisma.$transaction(async tx => {

        const review = await reviewsRepository.findById({reviewId, tx});
        if (review === null) {
            throw AppError.new({
                message: ErrorMessages.NOT_FOUND,
                status: HttpStatus.NOT_FOUND,
            });
        }

        const isAuthor = await reviewsRepository.isAuthor({userId, reviewId, tx});
        if (!isAuthor) {
            throw AppError.new({
                message: ErrorMessages.PERMISSION_DENIED,
                status: HttpStatus.FORBIDDEN,
            });
        }


        const {rating, movieId} = review

        await reviewsRepository.remove(tx, reviewId);

        if (rating !== null) {
            await reviewsRepository.createRating({movieId, rating: -rating, tx});
        }

    });
}

export default {
    getReviewOverviewsByUserId,
    getReviewDetail,
    write,
    edit,
    remove,
};
