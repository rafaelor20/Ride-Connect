import { Prisma } from '@prisma/client';
import { prisma } from '@/config';

async function createRide(data: Prisma.RideUncheckedCreateInput) {
  return prisma.ride.create({
    data: {
      customerId: data.customerId,
      driverId: data.driverId,
      originId: data.originId,
      destinationId: data.destinationId,
      distanceInKm: data.distanceInKm,
      durationInSec: data.durationInSec,
      valueInCents: data.valueInCents,
    },
    include: {
      customer: true,
      driver: true,
      origin: true,
      destination: true,
    },
  });
}

async function findById(id: number) {
  const params: Prisma.RideFindUniqueArgs = {
    where: {
      id,
    },
  };

  return prisma.ride.findUnique(params);
}

async function findByCustomerId(customerId: number) {
  const params: Prisma.RideFindManyArgs = {
    where: {
      customerId,
    },
    include: {
      driver: {
        select: {
          name: true, // Include only the driver's name
        },
      },
    },
  };

  return prisma.ride.findMany(params);
}

async function findByCustomerAndDriverId(customerId: number, driverId: number) {
  const params: Prisma.RideFindManyArgs = {
    where: {
      customerId,
      driverId,
    },

    include: {
      driver: {
        select: {
          name: true, // Include only the driver's name
        },
      },
    },
  };

  return prisma.ride.findMany(params);
}

const rideRepository = {
  createRide,
  findById,
  findByCustomerId,
  findByCustomerAndDriverId,
};

export default rideRepository;
