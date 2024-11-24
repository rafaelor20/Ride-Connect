import faker from '@faker-js/faker';
import { Destination } from '@prisma/client';
import { prisma } from '@/config';

export async function createDestination(params: Partial<Destination> = {}): Promise<Destination> {
  return prisma.destination.create({
    data: {
      address: params.address || faker.address.streetAddress(),
    },
  });
}
