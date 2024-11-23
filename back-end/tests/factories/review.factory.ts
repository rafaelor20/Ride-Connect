import faker from '@faker-js/faker';
import { prisma } from '@/config';
import { Review } from '@/models/review';

export async function createReview(params: Partial<Review> = {}): Promise<Review> {
  return prisma.review.create({
    data: {
      ride: { connect: { id: params.rideId } },
      rating: params.rating || faker.datatype.number(5),
      comment: params.comment || faker.lorem.sentence(),
    },
  });
}
