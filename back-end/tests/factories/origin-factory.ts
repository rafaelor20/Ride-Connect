import faker from '@faker-js/faker';
import { prisma } from '@/config';
import { Origin } from '@/models/origin';

export async function createOrigin(params: Partial<Origin> = {}): Promise<Origin> {
  return prisma.origin.create({
    data: {
      address: params.adress || faker.address.streetAddress(),
    },
  });
}
