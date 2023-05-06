import {CreateMovieReviewBody} from './dtos/create_movie_review.body';
import {EditMovieReviewBody} from './dtos/edit_review.body';
import {PickIdsWithTx} from "../core/types/pick_ids";
import {PaginationQuery} from "../core/dtos/inputs";
import {ReviewOutput, ReviewWithAuthor} from "./dtos/review_overview.output";
import {PaginationOutput} from "../core/dtos/outputs/pagination_output";
import {isDeleted} from "../utils/is_null_or_deleted";

/**
 * 조회(Fetch)
 */
async function findManyReviewsByUserId(
    {userId, tx}: PickIdsWithTx<'user'>,
    {count, after}: PaginationQuery,
): Promise<PaginationOutput<ReviewOutput>> {
    const entities = await tx.review.findMany({
        where: {
            authorId: userId,
        },
        ...(after !== undefined && {cursor: {id: after}}),
        skip: after ? 1 : 0,
        take: count + 1,
        include: {
            author: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    const reviews = entities
        .filter(r => !isDeleted(r))
        .map(r => ReviewOutput.from(r));
    return PaginationOutput.from(reviews, count);
}

async function findManyReviewsByMovieId(
    {movieId, tx}: PickIdsWithTx<'movie'>,
    {count, after}: PaginationQuery,
): Promise<PaginationOutput<ReviewOutput>> {
    const entities = await tx.review.findMany({
        where: {
            movieId,
        },
        ...(after !== undefined && {cursor: {id: after}}),
        skip: after ? 1 : 0,
        take: count + 1,
        include: {
            author: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    const reviews = entities.map(review => ReviewOutput.from(review));
    return PaginationOutput.from(reviews, count);
}

async function findById({reviewId, tx}: PickIdsWithTx<'review'>): Promise<ReviewOutput | null> {

    const review: ReviewWithAuthor | null = await tx.review.findUnique(
        {
            where: {
                id: reviewId,
            },
            include: {
                author: true,
            },
        },
    );
    return ReviewOutput.nullOrFrom(review);
}

async function isExists({reviewId, tx}: PickIdsWithTx<'review'>) {
    const isReviewExists = await findById({reviewId, tx});
    return isReviewExists;
}

async function isAuthor(
    {
        userId,
        reviewId,
        tx
    }: PickIdsWithTx<'user' | 'review'>,
) {
    const review = await findById({reviewId, tx});
    return review !== null && review.author.id === userId;
}


/**
 * 생성 및 수정(Mutation)
 */
async function create(
    {userId, movieId, tx}: PickIdsWithTx<'user' | 'movie'>,
    {title, content, rating}: CreateMovieReviewBody,
) {
    const {id} = await tx.review.create({
        data: {
            title,
            content,
            overview: content.slice(0, 100),
            rating,
            movieId,
            authorId: userId,
        },
        select: {
            id: true,
        },
    });
    return id;
}


async function update(
    {reviewId, tx}: PickIdsWithTx<'review'>,
    data: EditMovieReviewBody) {

    await tx.review.update({
        where: {
            id: reviewId,
        },
        data: {
            ...data,
            // content가 존재할 경우에만 overview를 재생성
            ...(data.content && {
                overview: data.content.slice(0, 100),
            }),
        },
        select: {id: true},
    });
}

async function remove(
    {tx, reviewId}: PickIdsWithTx<'review'>,
) {
    await tx.review.update({
        where: {
            id: reviewId,
        },
        data: {
            deletedAt: new Date(),
        },
    });
}

/**
 * RATING
 */
async function createRating(
    {
        tx,
        movieId,
        rating
    }: PickIdsWithTx<'movie'> & { rating: number }) {
    await tx.rating.create({
        data: {
            rating,
            movieId,
        }
    });
}


async function totalRatingByMovieId({movieId, tx}: PickIdsWithTx<'movie'>) {
    const ratings = await tx.rating.findMany({
        where: {
            movieId,
        },
        select: {
            rating: true,
        }
    });

    return ratings.reduce((acc, cur) => acc + cur.rating, 0);
}

export default {
    findById,
    findManyReviewsByUserId,
    findManyReviewsByMovieId,
    createRating,
    totalRatingByMovieId,
    isExists,
    isAuthor,
    create,
    update,
    remove,
};
