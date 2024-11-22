import { Prisma } from '@prisma/client';
import { prisma } from '@/config';

async function createReview(data: Prisma.ReviewUncheckedCreateInput) {
  return prisma.review.create({
    data,
  });
}

async function findById(id: number, select?: Prisma.ReviewSelect) {
  const params: Prisma.ReviewFindUniqueArgs = {
    where: {
      id,
    },
  };

  if (select) {
    params.select = select;
  }

  return prisma.review.findUnique(params);
}

const reviewRepository = {
  createReview,
  findById,
};

export default reviewRepository;
