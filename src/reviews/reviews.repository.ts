import {prisma} from '../config/db';
import {CreateMovieReviewBody} from './dtos/create_movie_review.body';
import {EditMovieReviewBody} from './dtos/edit_review.body';
import {PaginationRecord, UserRecord} from "../core/types/tx";
import {PickIdsWithTx} from "../core/types/pick_ids";

/**
 * 조회(Fetch)
 */
async function findManyByAuthorId(
    {userId, skip, take}: Pick<UserRecord, 'userId'> & PaginationRecord,
) {
    return prisma.review.findMany({
        where: {
            authorId: userId,
            deletedAt: null,
        },
        skip,
        take,
        orderBy: {
            createdAt: 'desc',
        },

        select: {
            id: true,
            title: true,
            overview: true,
            rating: true,
            createdAt: true,
            updatedAt: true,
            author: {
                select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                }
            }
        }
    });
}

async function findById({reviewId, tx}: PickIdsWithTx<'review'>) {
    return tx.review.findUnique({where: {id: reviewId}});
}

async function isExists({reviewId, tx}: PickIdsWithTx<'review'>) {
    const review = await findById({reviewId, tx});
    return review !== null && review.deletedAt === null;
}

async function isAuthor(
    {
        userId,
        reviewId,
        tx
    }: PickIdsWithTx<'user' | 'review'>,
) {
    const review = await findById({reviewId, tx});
    return review !== null && review.authorId === userId;
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
    findManyByAuthorId,
    createRating,
    totalRatingByMovieId,
    isExists,
    isAuthor,
    create,
    update,
    remove,
};
