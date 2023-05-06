import {ErrorMessages, HttpStatus} from '../core/constants';
import {AppError} from '../core/types';
import {CreateMovieReviewBody} from './dtos/create_movie_review.body';
import {EditMovieReviewBody} from './dtos/edit_review.body';
import reviewsRepository from './reviews.repository';
import {prisma} from "../config/db";
import {UserRecord} from "../core/types/tx";
import {PaginationQuery} from "../core/dtos/inputs";
import {PickIds} from "../core/types/pick_ids";
import {PaginationOutput} from "../core/dtos/outputs/pagination_output";
import {ReviewOutput} from "./dtos/review_overview.output";

async function reviewsByUserId(
    {userId}: PickIds<'user'>,
    p: PaginationQuery,
): Promise<PaginationOutput<ReviewOutput>> {
    return prisma.$transaction(async tx => {
        return reviewsRepository.findManyReviewsByUserId({userId, tx}, p);
    });
}

async function reviewsByMovieId(
    {movieId}: PickIds<'movie'>,
    p: PaginationQuery,
): Promise<PaginationOutput<ReviewOutput>> {
    return prisma.$transaction(async tx => {
        return reviewsRepository.findManyReviewsByMovieId({movieId, tx}, p);
    });
}


// TODO:
async function reviewDetail({reviewId}: PickIds<'review'>) {
    return prisma.$transaction(async tx => {
        return reviewsRepository.findById({reviewId, tx});
    });
}

// TODO: Pagination
async function reviewOverviewsByUserId(
    {
        userId,
    }
        : Pick<UserRecord, 'userId'> & PaginationQuery,
) {
    // return reviewsRepository.findManyByAuthorId({userId, skip, take});
}

async function write(
    {userId, movieId}: PickIds<'user' | 'movie'>,
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
    }: PickIds<'user' | 'review'>,
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

        await reviewsRepository.update({reviewId, tx}, body);
    });

}

async function remove({userId, reviewId}: PickIds<'user' | 'review'>) {

    return prisma.$transaction(async tx => {

        const review = await reviewsRepository.findById({reviewId, tx});
        if (review === null) {
            throw AppError.new({
                message: ErrorMessages.NOT_FOUND,
                status: HttpStatus.NOT_FOUND,
            });
        }

        if (review.author.id !== userId) {
            throw AppError.new({
                message: ErrorMessages.PERMISSION_DENIED,
                status: HttpStatus.FORBIDDEN,
            });
        }

        // const isAuthor = await reviewsRepository.isAuthor({userId, reviewId, tx});
        // if (!isAuthor) {
        //     throw AppError.new({
        //         message: ErrorMessages.PERMISSION_DENIED,
        //         status: HttpStatus.FORBIDDEN,
        //     });
        // }


        const {rating, movieId} = review;

        await reviewsRepository.remove({tx, reviewId});

        if (rating !== null) {
            await reviewsRepository.createRating({movieId, rating: -rating, tx});
        }

    });
}

export default {
    reviewsByUserId,
    reviewsByMovieId,
    reviewDetail,
    write,
    edit,
    remove,
};
