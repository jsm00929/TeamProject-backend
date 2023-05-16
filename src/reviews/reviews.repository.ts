import { prisma } from '../config/db';

export const reviewRepository = {
  async findReviewById(tx, reviewId: number) {
    return await tx.review.findUnique({
      where: {
        id: reviewId,
      },
    });
  },
};
