import faker from '@faker-js/faker';
import { prisma } from '@/config';
import { Destination } from '@/models/destination';

export async function createDestination(params: Partial<Destination> = {}): Promise<Destination> {
  return prisma.destination.create({
    data: {
      address: params.adress || faker.address.streetAddress(),
    },
  });
}
