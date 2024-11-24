import faker from '@faker-js/faker';
import { Origin } from '@prisma/client';
import { prisma } from '@/config';

export async function createOrigin(params: Partial<Origin> = {}): Promise<Origin> {
  return prisma.origin.create({
    data: {
      address: params.address || faker.address.streetAddress(),
    },
  });
}
