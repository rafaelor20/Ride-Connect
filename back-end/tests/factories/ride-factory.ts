import faker from '@faker-js/faker';
import { Ride } from '@prisma/client';
import { prisma } from '@/config';

export async function createRide(params: Partial<Ride> = {}): Promise<Ride> {
  return prisma.ride.create({
    data: {
      customer: {
        connect: {
          id: params.customerId,
        },
      },
      driver: {
        connect: {
          id: params.driverId,
        },
      },
      origin: {
        connect: {
          id: params.originId,
        },
      },
      destination: {
        connect: {
          id: params.destinationId,
        },
      },
      durationInSec: params.durationInSec || faker.datatype.number(1000),
      distanceInKm: params.distanceInKm || faker.datatype.number(100),
      valueInCents: params.valueInCents || faker.datatype.number(1000),
    },
  });
}
