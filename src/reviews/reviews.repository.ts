import {PaginationQuery} from '../core/dtos/inputs/pagination.query';
import {prisma} from '../config/db';
import {CreateMovieReviewBody} from './dtos/create_movie_review.body';
import {EditMovieReviewBody} from './dtos/edit_review.body';

/**
 * 조회(Fetch)
 */
async function findManyByAuthorId(
    userId: number,
    {skip, take}: PaginationQuery,
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

async function findById(reviewId: number) {
    return prisma.review.findUnique({where: {id: reviewId}});
}

async function isExists(reviewId: number) {
    const review = await findById(reviewId);
    return review !== null && review.deletedAt === null;
}

async function isAuthor(userId: number, reviewId: number) {
    const review = await findById(reviewId);
    return review !== null && review.authorId === userId;
}

/**
 * 생성 및 수정(Mutation)
 */
async function create(
    userId: number,
    movieId: number,
    {title, content, rating}: CreateMovieReviewBody,
) {
    const {id} = await prisma.review.create({
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

async function update(reviewId: number, editReviewInput: EditMovieReviewBody) {
    await prisma.review.update({
        where: {
            id: reviewId,
        },
        data: {
            ...editReviewInput,
            // content가 존재할 경우에만 overview를 재생성
            ...(editReviewInput.content && {
                overview: editReviewInput.content.slice(0, 100),
            }),
        },
        select: {id: true},
    });
}

async function remove(reviewId: number) {
    await prisma.review.update({
        where: {
            id: reviewId,
        },
        data: {
            deletedAt: new Date(),
        },
        select: {
            id: true,
        },
    });
}

export default {
    findById,
    findManyByAuthorId,
    isExists,
    isAuthor,
    create,
    update,
    remove,
};
