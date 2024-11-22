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

const rideRepository = {
  createRide,
  findById,
};

export default rideRepository;
