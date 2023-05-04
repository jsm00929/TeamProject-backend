import {prisma} from '../config/db';
import {CreateMovieReviewBody} from './dtos/create_movie_review.body';
import {EditMovieReviewBody} from './dtos/edit_review.body';
import {
    MovieRecord,
    PaginationRecord,
    prismaClient,
    RatingRecord,
    ReviewRecord,
    TxRecord,
    UserRecord
} from "../core/types/tx";

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

async function findById({reviewId, tx}: Pick<ReviewRecord, 'reviewId'> & TxRecord) {
    return prismaClient(tx).review.findUnique({where: {id: reviewId}});
}

async function isExists({reviewId, tx}: Pick<ReviewRecord, 'reviewId'> & TxRecord) {
    const review = await findById({reviewId, tx});
    return review !== null && review.deletedAt === null;
}

async function isAuthor({
                            userId,
                            reviewId,
                            tx
                        }: Pick<UserRecord, 'userId'> & Pick<ReviewRecord, 'reviewId'> & TxRecord) {
    const review = await findById({reviewId, tx});
    return review !== null && review.authorId === userId;
}


/**
 * 생성 및 수정(Mutation)
 */
async function create(
    {userId, movieId, tx}: Pick<UserRecord, 'userId'> & Pick<MovieRecord, 'movieId'> & TxRecord,
    {title, content, rating}: CreateMovieReviewBody,
) {
    const {id} = await prismaClient(tx).review.create({
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
    {reviewId, tx}: TxRecord & Pick<ReviewRecord, 'reviewId'>,
    body: EditMovieReviewBody) {

    await prismaClient(tx).review.update({
        where: {
            id: reviewId,
        },
        data: {
            ...body,
            // content가 존재할 경우에만 overview를 재생성
            ...(body.content && {
                overview: body.content.slice(0, 100),
            }),
        },
        select: {id: true},
    });
}

async function remove(
    {tx, reviewId}: TxRecord & Pick<ReviewRecord, 'reviewId'>
) {
    await prismaClient(tx).review.update({
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
async function createRating({
                                tx,
                                movieId,
                                rating
                            }: Pick<MovieRecord, 'movieId'> & Pick<RatingRecord, 'rating'> & TxRecord) {
    await prismaClient(tx).rating.create({
        data: {
            rating,
            movieId,
        }
    });
}


async function totalRatingByMovieId({movieId, tx}: TxRecord & Pick<MovieRecord, 'movieId'>) {
    const ratings = await prismaClient(tx).rating.findMany({
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
