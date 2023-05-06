import {prisma} from '../config/db';
import {UpdateMovieReviewCommentBody as UpdateMovieCommentBody} from './dtos/inputs/create_movie_review_comment.body';

/**
 * 조회
 */
async function findById(commentId: number) {
    return prisma.comment.findUnique({
        where: {
            id: commentId,
        },
    });
}


async function exists(commentId: number) {
    const comment = await findById(commentId);
    return comment !== null;
}

async function isAuthor(userId: number, commentId: number) {
    const comment = await findById(commentId);
    return comment !== null && comment.authorId === userId;
}

/**
 * 생성 및 수정
 */
async function create(
    userId: number,
    reviewId: number,
    {content}: UpdateMovieCommentBody,
) {
    const {id} = await prisma.comment.create({
        data: {
            content,
            authorId: userId,
            reviewId,
        },
        select: {
            id: true,
        },
    });
    return id;
}

async function update(
    commentId: number,
    updateMovieCommentBody: UpdateMovieCommentBody,
) {
    return prisma.comment.update({
        where: {
            id: commentId,
        },
        data: updateMovieCommentBody,
        select: {
            id: true,
        },
    });
}

async function remove(reviewId: number) {
    await prisma.comment.update({
        where: {
            id: reviewId,
        },
        data: {
            deletedAt: new Date(),
        },
    });
}

export default {
    findById,
    exists,
    isAuthor,
    create,
    update,
    remove,
};
