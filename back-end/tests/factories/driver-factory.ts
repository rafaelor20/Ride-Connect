import faker from '@faker-js/faker';
import { prisma } from '@/config';
import { Driver } from '@/models/driver';

export async function createDriver(params: Partial<Driver> = {}): Promise<Driver> {
  return prisma.driver.create({
    data: {
      name: params.name || faker.name.findName(),
      description: params.description || faker.lorem.sentence(),
      vehicle: params.vehicle || faker.vehicle.vehicle(),
      pricePerKmInCents: params.pricePerKmInCents || faker.datatype.number(1000),
      minKm: params.minKm || faker.datatype.number(100),
    },
  });
}
