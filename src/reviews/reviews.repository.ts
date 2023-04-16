import { PaginationQuery } from '../core/dtos/inputs/pagination.query';
import { prisma } from '../config/db';
import { CreateReviewInput } from './dtos/create_review.input';
import { EditReviewInput } from './dtos/edit_review.input';
import { ReviewOverviewOutput } from './dtos/review_overview.output';

async function getReviewOverviewsByUserId(
  userId: number,
  { skip, take }: PaginationQuery,
): Promise<ReviewOverviewOutput[]> {
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
        },
      },
    },
  });
}

async function create(
  userId: number,
  { title, content, rating }: CreateReviewInput,
) {
  const { id } = await prisma.review.create({
    data: {
      title,
      content,
      overview: content.slice(0, 100),
      rating,
      authorId: userId,
    },
    select: {
      id: true,
    },
  });
  return id;
}

async function update(reviewId: number, editReviewInput: EditReviewInput) {
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
    select: { id: true },
  });
}

async function isAuthor(userId: number, reviewId: number) {
  const exists = await prisma.review.findFirst({
    where: { authorId: userId, id: reviewId },
    select: { id: true },
  });
  return !!exists;
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
  getReviewOverviewsByUserId,
  create,
  update,
  remove,
  isAuthor,
};
