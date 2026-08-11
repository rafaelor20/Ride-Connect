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

export type RideFilterDateOptions = {
  date?: string;
  startDate?: string;
  endDate?: string;
};

function buildDateFilter(dateOptions?: RideFilterDateOptions): Prisma.DateTimeFilter | undefined {
  if (!dateOptions) return undefined;
  const { date, startDate, endDate } = dateOptions;

  if (date) {
    const start = new Date(`${date}T00:00:00.000Z`);
    const end = new Date(`${date}T23:59:59.999Z`);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      return { gte: start, lte: end };
    }
  }

  const dateFilter: Prisma.DateTimeFilter = {};
  if (startDate) {
    const start = new Date(`${startDate}T00:00:00.000Z`);
    if (!isNaN(start.getTime())) {
      dateFilter.gte = start;
    }
  }
  if (endDate) {
    const end = new Date(`${endDate}T23:59:59.999Z`);
    if (!isNaN(end.getTime())) {
      dateFilter.lte = end;
    }
  }

  return Object.keys(dateFilter).length > 0 ? dateFilter : undefined;
}

async function findByCustomerId(customerId: number, dateOptions?: RideFilterDateOptions) {
  const dateFilter = buildDateFilter(dateOptions);
  const where: Prisma.RideWhereInput = {
    customerId,
    ...(dateFilter ? { createdAt: dateFilter } : {}),
  };

  const params: Prisma.RideFindManyArgs = {
    where,
    include: {
      driver: {
        select: {
          name: true, // Include only the driver's name
        },
      },
      origin: {
        select: {
          address: true, // Include only the origin's address
        },
      },
      destination: {
        select: {
          address: true, // Include only the destination's address
        },
      },
    },
  };
  const rides = await prisma.ride.findMany(params);
  return rides.reverse();
}

async function findByCustomerAndDriverId(customerId: number, driverId: number, dateOptions?: RideFilterDateOptions) {
  const dateFilter = buildDateFilter(dateOptions);
  const where: Prisma.RideWhereInput = {
    customerId,
    driverId,
    ...(dateFilter ? { createdAt: dateFilter } : {}),
  };

  const params: Prisma.RideFindManyArgs = {
    where,
    include: {
      driver: {
        select: {
          name: true, // Include only the driver's name
        },
      },
      origin: {
        select: {
          address: true, // Include only the origin's address
        },
      },
      destination: {
        select: {
          address: true, // Include only the destination's address
        },
      },
    },
  };
  const rides = await prisma.ride.findMany(params);
  return rides.reverse();
}

const rideRepository = {
  createRide,
  findById,
  findByCustomerId,
  findByCustomerAndDriverId,
};

export default rideRepository;

